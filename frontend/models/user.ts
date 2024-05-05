import { BackendInternalTokenerCreateTokenResponse } from '../api/generated/api'

export class UserTokenInfo {
	accessToken!: string
	refreshToken!: string

	constructor(dto: BackendInternalTokenerCreateTokenResponse) {
		this.accessToken = dto.access_token || ''
		this.refreshToken = dto.refresh_token || ''
	}

}