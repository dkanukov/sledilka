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

export interface EntityCoordinate {
  x?: number;
  y?: number;
}

export interface EntityDevice {
  created_at?: string;
  id?: string;
  /** для подключения к камерам и мб для других нужд, хз */
  ip?: string;
  is_active?: boolean;
  /** ?? */
  layer_id?: string;
  location_x?: number;
  location_y?: number;
  mac_address?: string;
  name?: string;
  type?: EntityDeviceType;
  updated_at?: string;
}

export enum EntityDeviceType {
  Computer = "computer",
  Camera = "camera",
  Printer = "printer",
}

export interface EntityLayer {
  angle?: number;
  angles_coordinates?: EntityCoordinate[];
  coordinate_x?: number;
  coordinate_y?: number;
  created_at?: string;
  devices?: EntityDevice[];
  floor_name?: string;
  id?: string;
  image?: string;
  object_id?: string;
  updated_at?: string;
}

export interface EntityLoginInfo {
  password?: string;
  username?: string;
}

export interface EntityNewAnnouncement {
  description?: string;
  title?: string;
}

export interface EntityNewDevice {
  /** для подключения к камерам и мб для других нужд, хз */
  ip?: string;
  /** ?? */
  layer_id?: string;
  location_x?: number;
  location_y?: number;
  mac_address?: string;
  name?: string;
  type?: EntityDeviceType;
}

export interface EntityNewLayer {
  angle?: number;
  angles_coordinates?: EntityCoordinate[];
  coordinate_x?: number;
  coordinate_y?: number;
  floor_name?: string;
  image?: string;
}

export interface EntityNewObject {
  address?: string;
  description?: string;
  name?: string;
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

export interface EntityObject {
  address?: string;
  created_at?: string;
  description?: string;
  id?: string;
  layers?: EntityLayer[];
  name?: string;
  updated_at?: string;
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

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "//0.0.0.0:8081" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Sledilka API
 * @version 1.0
 * @termsOfService http://swagger.io/terms/
 * @baseUrl //0.0.0.0:8081
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
  devices = {
    /**
     * No description
     *
     * @tags devices
     * @name DevicesCreate
     * @summary Создать девайс
     * @request POST:/devices
     */
    devicesCreate: (request: EntityNewDevice, params: RequestParams = {}) =>
      this.request<EntityDevice, void>({
        path: `/devices`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags devices
     * @name DevicesPartialUpdate
     * @summary Изменить девайс
     * @request PATCH:/devices/{id}
     */
    devicesPartialUpdate: (id: string, request: EntityNewDevice, params: RequestParams = {}) =>
      this.request<EntityDevice, void>({
        path: `/devices/${id}`,
        method: "PATCH",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  images = {
    /**
     * No description
     *
     * @tags images
     * @name ImagesCreate
     * @summary Upload File
     * @request POST:/images
     */
    imagesCreate: (
      data: {
        /**
         * картинка слоя
         * @format binary
         */
        request: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/images`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags images
     * @name ImagesDetail
     * @summary Load File
     * @request GET:/images/{file}
     */
    imagesDetail: (file: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/images/${file}`,
        method: "GET",
        format: "document",
        ...params,
      }),
  };
  new = {
    /**
     * No description
     *
     * @tags new
     * @name PostNew
     * @summary Новые сущности
     * @request POST:/new
     */
    postNew: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/new`,
        method: "POST",
        ...params,
      }),
  };
  objects = {
    /**
     * No description
     *
     * @tags objects
     * @name ObjectsList
     * @summary Возвращает все объекты
     * @request GET:/objects
     */
    objectsList: (params: RequestParams = {}) =>
      this.request<EntityObject[], void>({
        path: `/objects`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags objects
     * @name ObjectsCreate
     * @summary Создать объект
     * @request POST:/objects
     */
    objectsCreate: (request: EntityNewObject, params: RequestParams = {}) =>
      this.request<EntityObject, void>({
        path: `/objects`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags objects
     * @name ObjectsDetail
     * @summary Объект по id
     * @request GET:/objects/{id}
     */
    objectsDetail: (id: string, params: RequestParams = {}) =>
      this.request<EntityObject, void>({
        path: `/objects/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags objects
     * @name ObjectsPartialUpdate
     * @summary Изменить объект
     * @request PATCH:/objects/{id}
     */
    objectsPartialUpdate: (id: string, request: EntityNewObject, params: RequestParams = {}) =>
      this.request<EntityObject, void>({
        path: `/objects/${id}`,
        method: "PATCH",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags layers
     * @name LayersCreate
     * @summary Создать слой
     * @request POST:/objects/{id}/layers
     */
    layersCreate: (id: string, request: EntityNewLayer, params: RequestParams = {}) =>
      this.request<EntityLayer, void>({
        path: `/objects/${id}/layers`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags layers
     * @name LayersPartialUpdate
     * @summary Изменить объект
     * @request PATCH:/objects/{object_id}/layers/{layer_id}
     */
    layersPartialUpdate: (objectId: string, layerId: string, request: EntityNewLayer, params: RequestParams = {}) =>
      this.request<EntityLayer, void>({
        path: `/objects/${objectId}/layers/${layerId}`,
        method: "PATCH",
        body: request,
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
