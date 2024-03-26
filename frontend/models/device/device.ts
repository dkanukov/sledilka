import { EntityDevice, EntityDeviceType } from '../../api/generated/api'

const pathToIcons = '~/models/device/device-svgs'

export class Device {
	id!: string
	name!: string
	isActive!: boolean
	ip?: string
	macAddress?: string
	locationX!: number
	locationY!: number
	layerId!: string
	type!: EntityDeviceType

	constructor (dto: EntityDevice) {
		this.id = dto.id || ''
		this.name = dto.name || 'no name'
		this.isActive = Boolean(dto.is_active)
		this.ip = dto.ip
		this.macAddress = dto.mac_address
		this.layerId = dto.layer_id || 'no-layer-id-device'
		this.type = dto.type || EntityDeviceType.Computer
		this.locationX = dto.location_x || 0
		this.locationY = dto.location_y || 0
	}

	getDeviceIcon() {
		switch (this.type) {
		case EntityDeviceType.Camera: return `${pathToIcons}/camera.svg`
		case EntityDeviceType.Printer: return `${pathToIcons}/printer.svg`
		case EntityDeviceType.Computer: return `${pathToIcons}/laptop.svg`
		}
	}
}

// created_at?: string;
// updated_at?: string;
