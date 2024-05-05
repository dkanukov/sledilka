/* eslint-disable compat/compat */
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

import { refreshToken } from '../services/auth'

import { lsGetItem } from '@helpers'
import { UserTokenInfo } from '@models'

const AUTH_RETRIES_COUNT = 1

class RetryGroupMetadata {
	readonly lastRetry = Date.now()
	constructor(readonly retriesLeft: number) {}
}

const retriesInProgress = new Map<string, RetryGroupMetadata>()

const generateRandomId = (): string => {
	return Math.random()
		.toString(16)
		.substring(2) // удаляет '0.' из начала строки, оставляя шестнадцатеричное число
}

const getFormattedEndpoint = (config: AxiosRequestConfig): string => {
	console.log(config)
	const { method, url, baseURL } = config
	const fullUrl = url ? new URL(url, baseURL).href : ''
	return `${method?.toUpperCase()} ${fullUrl}`
}

export const http401ErrorHandler = (axios: AxiosInstance) => {
	axios.interceptors.response.use(
		(response) => {
			const { retryGroupId } = response.config

			if (retryGroupId) {
				console.warn(`Запрос ${getFormattedEndpoint(response.config)} был успешно повторно выполнен после ошибки HTTP 401. ID серии повторений запроса: ${retryGroupId}.`)
				retriesInProgress.delete(retryGroupId)
			}

			return response
		},

		async (error: AxiosError) => {
			const isAuthError = error.response?.status === 401

			if (isAuthError) {
				const retryGroupId = error.config!.retryGroupId ??= generateRandomId()
				const retriesLeft = retriesInProgress.get(retryGroupId)?.retriesLeft ?? AUTH_RETRIES_COUNT

				const warningPrefix = `Возникла ошибка HTTP 401 при запросе ${getFormattedEndpoint(error.config!)}. ID серии повторений запроса: ${retryGroupId}.`

				if (retriesLeft > 0) {
					console.warn(`${warningPrefix} Будут выполнены обновление access-токена и повторный запрос. Осталось попыток: ${retriesLeft}.`)
					const oldTokens = lsGetItem<UserTokenInfo>('user-credential')

					await refreshToken(oldTokens!.refreshToken)

					error.config!.needsTokenRefresh = true
					retriesInProgress.set(retryGroupId, new RetryGroupMetadata(retriesLeft - 1))
					return axios.request(error.config!)
				}

				retriesInProgress.delete(retryGroupId)
				console.warn(`${warningPrefix}. Было выполнено повторных запросов: ${AUTH_RETRIES_COUNT}, производится переход на страницу авторизации.`)

				// const { logout } = await (await tokenProvider)()
				// logout()
			}

			return Promise.reject(error)
		},
	)
}
