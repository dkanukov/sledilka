import { http401ErrorHandler } from '../base'

import { Api } from './api'

import { lsGetItem } from '@helpers'
import { UserTokenInfo } from '@models'

const createApi = () => {
	const api = new Api({
		baseURL: 'http://localhost:8081',
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
