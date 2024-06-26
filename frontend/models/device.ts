import { BackendInternalEntityDevice, BackendInternalEntityDeviceType } from '../api/generated/api'

export class Device {
	id!: string
	name!: string
	isActive!: boolean
	ip?: string
	macAddress?: string
	coordinates!: [number, number]
	connectionURL?: string
	layerId!: string
	type!: BackendInternalEntityDeviceType
	angle!: number

	constructor (dto: BackendInternalEntityDevice) {
		this.id = dto.id || ''
		this.name = dto.name || 'no name'
		this.isActive = Boolean(dto.is_active)
		this.ip = dto.ip
		this.macAddress = dto.mac_address
		this.connectionURL = dto.camera_connection_url
		this.layerId = dto.layer_id || 'no-layer-id-device'
		this.type = dto.type || BackendInternalEntityDeviceType.Computer
		this.coordinates = [dto.location_y || 0, dto.location_x || 0]
		this.angle = 0
	}
}

// created_at?: string;
// updated_at?: string;
