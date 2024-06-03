import { http401ErrorHandler } from '../base'

import { Api } from './api'
import { BASE_URL } from './base-url'

import { lsGetItem } from '@helpers'
import { UserTokenInfo } from '@models'

const createApi = () => {
	const api = new Api({
		baseURL: BASE_URL,
	})

	api.instance.interceptors.request.use((config) => {
		const tokens = lsGetItem<UserTokenInfo>('user-credential')
		config.headers['X-Auth-Token'] = tokens?.accessToken
		return config
	})

	http401ErrorHandler(api.instance)

	return api
}

export default createApi()
