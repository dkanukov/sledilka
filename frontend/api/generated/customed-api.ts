import { Api } from './api'

const CustomedApi = new Api()

CustomedApi.instance.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log(error)
	},
)

export default CustomedApi

//TODO: кастомные интерсепотры для ошибок 401 - пробуем рефрешнуть токен и повторить запрос
