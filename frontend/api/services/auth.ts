import { AuthorizationCreateTokenResponse, EntityLoginInfo } from '../generated/api'
import CustomedApi from '../generated/customed-api'

import { lsSetItem } from '@helpers'

export const login = async (userCredential: EntityLoginInfo) => {
	try {
		const { data } = await CustomedApi.token.tokenCreate(userCredential)
		if (data.access_token && data.refresh_token) {
			lsSetItem<AuthorizationCreateTokenResponse>('user-credential', data)
			return true
		}
		return true
	} catch (e) {
		console.log(e)
		return false
	}
}
