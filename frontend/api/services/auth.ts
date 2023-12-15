import { Api, EntityLoginInfo } from '../generated/api'

const api = new Api()

export const login = async (userCredential: EntityLoginInfo) => {
	const { data } = await api.token.tokenCreate(userCredential)
	console.log(data)
}
