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

export interface BackendInternalDbmodelCoordinate {
  lat?: number;
  long?: number;
}

export enum BackendInternalDbmodelDeviceType {
  DeviceTypeComputer = "computer",
  DeviceTypeCamera = "camera",
  DeviceTypePrinter = "printer",
}

export interface BackendInternalEntityCreateDevice {
  angle?: number;
  camera_connection_url?: string;
  ip_address?: string;
  layer_id?: string;
  location_x?: number;
  location_y?: number;
  mac_address?: string;
  name?: string;
  type?: BackendInternalDbmodelDeviceType;
}

export interface BackendInternalEntityDevice {
  angle?: number;
  camera_connection_url?: string;
  created_at?: string;
  id?: string;
  ip?: string;
  is_active?: boolean;
  /** ?? */
  layer_id?: string;
  location_x?: number;
  location_y?: number;
  mac_address?: string;
  name?: string;
  type?: BackendInternalEntityDeviceType;
  updated_at?: string;
}

export interface BackendInternalEntityDeviceStatus {
  ipAddress?: string;
  isActive?: boolean;
  is_busy?: boolean;
  macAddress?: string;
}

export enum BackendInternalEntityDeviceType {
  Computer = "computer",
  Camera = "camera",
  Printer = "printer",
}

export interface BackendInternalEntityLayer {
  angle?: number;
  angles_coordinates?: BackendInternalDbmodelCoordinate[];
  created_at?: string;
  devices?: BackendInternalEntityDevice[];
  floor_name?: string;
  id?: string;
  image?: string;
  object_id?: string;
  updated_at?: string;
}

export interface BackendInternalEntityLoginInfo {
  password?: string;
  username?: string;
}

export interface BackendInternalEntityNewDevice {
  angle?: number;
  camera_connection_url?: string;
  ip?: string;
  /** ?? */
  layer_id?: string;
  location_x?: number;
  location_y?: number;
  mac_address?: string;
  name?: string;
  type?: BackendInternalEntityDeviceType;
}

export interface BackendInternalEntityNewLayer {
  angle?: number;
  angles_coordinates?: BackendInternalDbmodelCoordinate[];
  floor_name?: string;
  image?: string;
}

export interface BackendInternalEntityNewObject {
  address?: string;
  description?: string;
  lat?: number;
  long?: number;
  name?: string;
}

export interface BackendInternalEntityNewUser {
  is_admin?: boolean;
  password?: string;
  username?: string;
}

export interface BackendInternalEntityObject {
  address?: string;
  created_at?: string;
  description?: string;
  id?: string;
  lat?: number;
  layers?: BackendInternalEntityLayer[];
  long?: number;
  name?: string;
  updated_at?: string;
}

export interface BackendInternalEntityUserInfo {
  id?: string;
  is_admin?: boolean;
  username?: string;
}

export interface BackendInternalTokenerCreateTokenResponse {
  access_token?: string;
  expires_at?: TimestamppbTimestamp;
  refresh_token?: string;
}

export interface BackendInternalTokenerRefreshTokenResponse {
  access_token?: string;
  expires_at?: TimestamppbTimestamp;
  refresh_token?: string;
}

export interface TimestamppbTimestamp {
  /**
   * Non-negative fractions of a second at nanosecond resolution. Negative
   * second values with fractions must still have non-negative nanos values
   * that count forward in time. Must be from 0 to 999,999,999
   * inclusive.
   */
  nanos?: number;
  /**
   * Represents seconds of UTC time since Unix epoch
   * 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   * 9999-12-31T23:59:59Z inclusive.
   */
  seconds?: number;
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
  devices = {
    /**
     * No description
     *
     * @tags devices
     * @name DevicesCreate
     * @summary Создать девайс
     * @request POST:/devices
     * @secure
     */
    devicesCreate: (request: BackendInternalEntityCreateDevice, params: RequestParams = {}) =>
      this.request<BackendInternalEntityDevice, void>({
        path: `/devices`,
        method: "POST",
        body: request,
        secure: true,
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
     * @secure
     */
    devicesPartialUpdate: (id: string, request: BackendInternalEntityNewDevice, params: RequestParams = {}) =>
      this.request<BackendInternalEntityDevice, void>({
        path: `/devices/${id}`,
        method: "PATCH",
        body: request,
        secure: true,
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
  isLowLight = {
    /**
     * No description
     *
     * @tags isLowLight
     * @name IsLowLightDetail
     * @summary получить трансляцию
     * @request GET:/isLowLight/{id}
     */
    isLowLightDetail: (id: string, params: RequestParams = {}) =>
      this.request<boolean, void>({
        path: `/isLowLight/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  network = {
    /**
     * No description
     *
     * @tags networking
     * @name NetworkList
     * @summary Получить список адресов в сети
     * @request GET:/network
     * @secure
     */
    networkList: (params: RequestParams = {}) =>
      this.request<BackendInternalEntityDeviceStatus[], void>({
        path: `/network`,
        method: "GET",
        secure: true,
        format: "json",
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
     * @secure
     */
    objectsList: (params: RequestParams = {}) =>
      this.request<BackendInternalEntityObject[], void>({
        path: `/objects`,
        method: "GET",
        secure: true,
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
     * @secure
     */
    objectsCreate: (request: BackendInternalEntityNewObject, params: RequestParams = {}) =>
      this.request<BackendInternalEntityObject, void>({
        path: `/objects`,
        method: "POST",
        body: request,
        secure: true,
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
     * @secure
     */
    objectsDetail: (id: string, params: RequestParams = {}) =>
      this.request<BackendInternalEntityObject, void>({
        path: `/objects/${id}`,
        method: "GET",
        secure: true,
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
     * @secure
     */
    objectsPartialUpdate: (id: string, request: BackendInternalEntityNewObject, params: RequestParams = {}) =>
      this.request<BackendInternalEntityObject, void>({
        path: `/objects/${id}`,
        method: "PATCH",
        body: request,
        secure: true,
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
     * @secure
     */
    layersCreate: (id: string, request: BackendInternalEntityNewLayer, params: RequestParams = {}) =>
      this.request<BackendInternalEntityLayer, void>({
        path: `/objects/${id}/layers`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags layers
     * @name LayersDetail
     * @summary Получить слой
     * @request GET:/objects/{object_id}/layers/{id}
     * @secure
     */
    layersDetail: (id: string, objectId: string, params: RequestParams = {}) =>
      this.request<BackendInternalEntityLayer, void>({
        path: `/objects/${objectId}/layers/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags layers
     * @name LayersPartialUpdate
     * @summary Изменить слой
     * @request PATCH:/objects/{object_id}/layers/{id}
     * @secure
     */
    layersPartialUpdate: (
      objectId: string,
      id: string,
      request: BackendInternalEntityNewLayer,
      params: RequestParams = {},
    ) =>
      this.request<BackendInternalEntityLayer, void>({
        path: `/objects/${objectId}/layers/${id}`,
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
      this.request<BackendInternalTokenerRefreshTokenResponse, void>({
        path: `/refresh`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  stream = {
    /**
     * No description
     *
     * @tags stream
     * @name StreamDetail
     * @summary получить трансляцию
     * @request GET:/stream/{id}
     */
    streamDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/stream/${id}`,
        method: "GET",
        type: ContentType.Json,
        ...params,
      }),
  };
  subscribeNetwork = {
    /**
     * No description
     *
     * @tags networking
     * @name SubscribeNetworkList
     * @summary Подписаться на обновления из сети. WebSocket
     * @request GET:/subscribe-network
     * @secure
     */
    subscribeNetworkList: (params: RequestParams = {}) =>
      this.request<BackendInternalEntityDevice, void>({
        path: `/subscribe-network`,
        method: "GET",
        secure: true,
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
    tokenCreate: (request: BackendInternalEntityLoginInfo, params: RequestParams = {}) =>
      this.request<BackendInternalTokenerCreateTokenResponse, void>({
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
      this.request<BackendInternalEntityUserInfo[], void>({
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
    userCreate: (request: BackendInternalEntityNewUser, params: RequestParams = {}) =>
      this.request<BackendInternalEntityUserInfo, void>({
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
      this.request<BackendInternalEntityUserInfo, void>({
        path: `/user/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
