import { AxiosInstance } from 'axios'

declare module 'axios' {
	interface AxiosRequestConfig {
		retryGroupId?: string
		needsTokenRefresh?: boolean
	}
}

export type ApiConstructor<T> = new (axios: AxiosInstance) => T
