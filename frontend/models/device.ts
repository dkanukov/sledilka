import { EntityDevice, EntityDeviceType } from '../api/generated/api'

export class Device {
	id!: string
	name!: string
	isActive!: boolean
	ip?: string
	macAddress?: string
	coordinates!: [number, number]
	layerId!: string
	type!: EntityDeviceType
	angle!: number

	constructor (dto: EntityDevice) {
		this.id = dto.id || ''
		this.name = dto.name || 'no name'
		this.isActive = Boolean(dto.is_active)
		this.ip = dto.ip
		this.macAddress = dto.mac_address
		this.layerId = dto.layer_id || 'no-layer-id-device'
		this.type = dto.type || EntityDeviceType.Computer
		this.coordinates = [dto.location_y || 0, dto.location_x || 0]
		this.angle = 0
	}
}

// created_at?: string;
// updated_at?: string;
