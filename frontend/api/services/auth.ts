import CustomedApi from '../generated/customed-api'
import { Api } from '../generated/api'

import { lsSetItem } from '@helpers'
import { UserTokenInfo } from '@models'
import { UserCredentials } from '@typos'

export const login = async (userCredential: UserCredentials) => {
	try {
		const { data } = await CustomedApi.token.tokenCreate({
			password: userCredential.password,
			username: userCredential.userName,
		})
		if (data.access_token && data.refresh_token) {
			const userCredential = new UserTokenInfo(data)
			lsSetItem('user-credential', userCredential)
			return true
		}
	} catch (e) {
		console.log(e)
		return false
	}
}

export const refreshToken = async (token: string) => {
	const api = new Api()
	const { data } = await api.refresh.refreshCreate({
		token,
	})

	const userCredential = new UserTokenInfo(data)
	lsSetItem('user-credential', userCredential)
	return userCredential
}
