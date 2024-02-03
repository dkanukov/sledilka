import { Api, EntityLoginInfo } from '../generated/api'

const api = new Api()

export const login = async (userCredential: EntityLoginInfo) => {
	try {
		const { data } = await api.token.tokenCreate(userCredential)
		return Boolean(data.access_token && data.refresh_token)
	} catch (e) {
		console.log(e)
		return false
	}
}
