/* eslint-disable compat/compat */
import { AxiosError } from 'axios'
import { notification } from 'antd'

import { Api } from './api'

const CustomedApi = new Api()

CustomedApi.instance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (!error.response) {
			notification.error({
				message: 'Network/Server Issue',
				description: 'Unable to reach the server or network issue. Please try again later.',
			})
			return Promise.reject(error)
		}

		switch (error.response.status) {
		case 401:
			notification.error({
				message: 'Unauthorized',
				description: 'You are not authorized. Please login and try again.',
			})
			break
		case 403:
			notification.error({
				message: 'Forbidden',
				description: 'You do not have permission to perform this action.',
			})
			break
		case 404:
			notification.error({
				message: 'Not Found',
				description: 'The requested resource was not found.',
			})
			break
		case 500:
			notification.error({
				message: 'Server Error',
				description: 'Internal server error. Please try again later.',
			})
			break
		default:
			notification.error({
				message: `Error ${error.response.status}`,
				description: error.response.statusText || 'An unknown error occurred',
			})
		}

		return Promise.reject(error)
	},
)

// CustomedApi.instance.interceptors.request.use()

export default CustomedApi

//TODO: кастомные интерсепотры для ошибок 401 - пробуем рефрешнуть токен и повторить запрос
