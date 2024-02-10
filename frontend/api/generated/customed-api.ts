import { AxiosError } from 'axios'
import { notification } from 'antd'

import { Api } from './api'

const CustomedApi = new Api()

CustomedApi.instance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			notification.error({
				message: error.message,
				description: 'Мы не смогли вас авторизовать',
			})
		}
		return {
			authError: error,
		}
	},
)

export default CustomedApi

//TODO: кастомные интерсепотры для ошибок 401 - пробуем рефрешнуть токен и повторить запрос
