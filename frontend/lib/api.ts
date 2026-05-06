import type { Survey, SurveyListItem, SurveyResponsePayload } from "@/lib/survey-types";

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set.");
  }

  return baseUrl.replace(/\/$/, "");
}

const API_BASE_URL = getApiBaseUrl();

type RequestJsonOptions = RequestInit & {
  cache?: RequestCache;
  next?: { revalidate?: number };
};

type CacheBehavior = {
  cache?: RequestCache;
  revalidate?: number;
};

type ApiErrorBody = {
  message?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function requestJson<T>(path: string, options: RequestJsonOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
    const errorMessage = errorBody?.message ?? `Request failed with status ${response.status}`;

    throw new ApiError(errorMessage, response.status);
  }

  return (await response.json()) as T;
}

function buildCacheOptions({ cache = "force-cache", revalidate = 60 }: CacheBehavior = {}): RequestJsonOptions {
  const options: RequestJsonOptions = { cache };

  if (cache !== "no-store") {
    options.next = { revalidate };
  }

  return options;
}

export async function getSurveys(options?: CacheBehavior) {
  const response = await requestJson<ApiResponse<SurveyListItem[]>>("/surveys", {
    ...buildCacheOptions(options),
  });
  return response.data;
}

export async function getSurvey(id: string, options?: CacheBehavior) {
  const response = await requestJson<ApiResponse<Survey>>(`/surveys/${id}`, {
    ...buildCacheOptions(options),
  });
  return response.data;
}

export async function submitSurveyResponse(id: string, payload: SurveyResponsePayload) {
  return requestJson<{ message?: string }>(`/surveys/${id}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createSurvey(payload: {
  title: string;
  description: string;
  schema: Survey["schema"];
}) {
  const response = await requestJson<ApiResponse<Survey>>("/surveys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateSurvey(
  id: string,
  payload: {
    title: string;
    description: string;
    schema: Survey["schema"];
  },
) {
  const response = await requestJson<ApiResponse<Survey>>(`/surveys/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function getSurveyAnalytics(id: string) {
  const response = await requestJson<ApiResponse<{
    totalResponses: number;
    questions: Array<
      | {
          questionId: string;
          title: string;
          type: "radio" | "checkbox";
          counts: Record<string, number>;
        }
      | {
          questionId: string;
          title: string;
          type: "rating";
          average: number;
        }
      | {
          questionId: string;
          title: string;
          type: "text";
          responses: string[];
        }
    >;
  }>>(`/surveys/${id}/analytics`, {
    cache: "no-store",
  });
  return response.data;
}
