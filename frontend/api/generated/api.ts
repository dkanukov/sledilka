/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthorizationCreateTokenResponse {
  access_token?: string;
  refresh_token?: string;
}

export interface EntityAnnouncement {
  createdAt?: string;
  description?: string;
  id?: string;
  title?: string;
}

export interface EntityLoginInfo {
  password?: string;
  username?: string;
}

export interface EntityNewAnnouncement {
  description?: string;
  title?: string;
}

export interface EntityNewReview {
  comment?: string;
  name?: string;
  rating?: number;
}

export interface EntityNewUser {
  password?: string;
  username?: string;
}

export interface EntityReview {
  comment?: string;
  createdAt?: string;
  id?: string;
  name?: string;
  rating?: number;
}

export interface EntityUserInfo {
  id?: number;
  username?: string;
}

export interface EntityUserToken {
  expires_in?: number;
  token?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "//localhost:8081";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Sledilka API
 * @version 1.0
 * @termsOfService http://swagger.io/terms/
 * @baseUrl //localhost:8081
 * @contact
 *
 * API for Sledilka service
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  announcement = {
    /**
     * No description
     *
     * @tags announcements
     * @name AnnouncementList
     * @summary Возвращает анонсы
     * @request GET:/announcement
     */
    announcementList: (params: RequestParams = {}) =>
      this.request<EntityAnnouncement[], void>({
        path: `/announcement`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcements
     * @name AnnouncementCreate
     * @summary Создает анонс
     * @request POST:/announcement
     */
    announcementCreate: (request: EntityNewAnnouncement, params: RequestParams = {}) =>
      this.request<EntityAnnouncement, void>({
        path: `/announcement`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcements
     * @name AnnouncementDetail
     * @summary Анонс по id
     * @request GET:/announcement/{id}
     * @secure
     */
    announcementDetail: (id: string, params: RequestParams = {}) =>
      this.request<EntityAnnouncement, void>({
        path: `/announcement/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcements
     * @name AnnouncementUpdate
     * @summary Изменить анонс
     * @request PUT:/announcement/{id}
     * @secure
     */
    announcementUpdate: (id: string, request: EntityNewAnnouncement, params: RequestParams = {}) =>
      this.request<EntityAnnouncement, void>({
        path: `/announcement/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcements
     * @name AnnouncementDelete
     * @summary Удаляет анонс
     * @request DELETE:/announcement/{id}
     * @secure
     */
    announcementDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/announcement/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcements
     * @name AnnouncementPartialUpdate
     * @summary Изменить анонс
     * @request PATCH:/announcement/{id}
     * @secure
     */
    announcementPartialUpdate: (id: string, request: EntityNewAnnouncement, params: RequestParams = {}) =>
      this.request<EntityAnnouncement, void>({
        path: `/announcement/${id}`,
        method: "PATCH",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  refresh = {
    /**
     * No description
     *
     * @tags token
     * @name RefreshCreate
     * @summary Обновить токен
     * @request POST:/refresh
     */
    refreshCreate: (
      query: {
        /** token */
        token: string;
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<EntityUserToken, void>({
        path: `/refresh`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  review = {
    /**
     * No description
     *
     * @tags reviews
     * @name ReviewList
     * @summary Возвращает все отзывы
     * @request GET:/review
     */
    reviewList: (params: RequestParams = {}) =>
      this.request<EntityReview[], void>({
        path: `/review`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewCreate
     * @summary Создать отзыв
     * @request POST:/review
     */
    reviewCreate: (request: EntityNewReview, params: RequestParams = {}) =>
      this.request<EntityReview, void>({
        path: `/review`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewDetail
     * @summary Отзыв по id
     * @request GET:/review/{id}
     * @secure
     */
    reviewDetail: (id: string, params: RequestParams = {}) =>
      this.request<EntityReview, void>({
        path: `/review/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewUpdate
     * @summary Изменить отзыв
     * @request PUT:/review/{id}
     * @secure
     */
    reviewUpdate: (id: string, request: EntityNewReview, params: RequestParams = {}) =>
      this.request<EntityReview, void>({
        path: `/review/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewDelete
     * @summary Удалить отзыв
     * @request DELETE:/review/{id}
     * @secure
     */
    reviewDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/review/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewPartialUpdate
     * @summary Изменить отзыв
     * @request PATCH:/review/{id}
     * @secure
     */
    reviewPartialUpdate: (id: string, request: EntityNewReview, params: RequestParams = {}) =>
      this.request<EntityReview, void>({
        path: `/review/${id}`,
        method: "PATCH",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  token = {
    /**
     * No description
     *
     * @tags token
     * @name TokenCreate
     * @summary Авторизоваться
     * @request POST:/token
     */
    tokenCreate: (request: EntityLoginInfo, params: RequestParams = {}) =>
      this.request<AuthorizationCreateTokenResponse, void>({
        path: `/token`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserList
     * @summary Получить список пользователей
     * @request GET:/user
     */
    userList: (params: RequestParams = {}) =>
      this.request<EntityUserInfo[], void>({
        path: `/user`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreate
     * @summary Зарегистрировать
     * @request POST:/user
     */
    userCreate: (request: EntityNewUser, params: RequestParams = {}) =>
      this.request<EntityUserInfo, void>({
        path: `/user`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDetail
     * @summary Получить информацию о пользователе по id
     * @request GET:/user/{id}
     */
    userDetail: (id: number, params: RequestParams = {}) =>
      this.request<EntityUserInfo, void>({
        path: `/user/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
