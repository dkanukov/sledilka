import { AuthorizationCreateTokenResponse, EntityLoginInfo } from '../generated/api'
import CustomedApi from '../generated/customed-api'

import { lsSetItem } from '@helpers'

export const login = async (userCredential: EntityLoginInfo) => {
	const { data, error } = await CustomedApi.token.tokenCreate(userCredential)

	lsSetItem<AuthorizationCreateTokenResponse>('user-credential', data)

	return data
}
