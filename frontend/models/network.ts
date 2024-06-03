import { BackendInternalEntityDeviceStatus } from '../api/generated/api'

export class NetworkItem {
	ipAddress!: string
	isActive!: boolean
	isBusy!: boolean
	macAddress!: string

	constructor(dto: BackendInternalEntityDeviceStatus) {
		this.isBusy = dto.is_busy || false
		this.ipAddress = dto.ipAddress || ''
		this.isActive = dto.isActive || false
		this.macAddress = dto.macAddress || ''
	}
}