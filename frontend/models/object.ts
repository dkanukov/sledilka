import { BackendInternalEntityLayer, BackendInternalEntityObject } from '../api/generated/api'

import { Device } from '@models'
import { Area } from '@typos'

export class ObjectStorage {
	id!: string
	name!: string
	address!: string
	description!: string
	layers!: ObjectLayer[]
	updatedAt!: string
	createdAt!: string

	constructor(dto: BackendInternalEntityObject) {
		this.id = dto.id || ''
		this.name = dto.name || ''
		this.address = dto.address || ''
		this.description = dto.description || ''
		this.createdAt = dto.created_at || ''
		this.updatedAt = dto.updated_at || ''
		this.layers = dto.layers?.map((dtoLayer) => new ObjectLayer(dtoLayer)) ?? []
	}
}

export class ObjectLayer {
	id!: string
	objectId!: string
	floorName!: string
	angle: number
	image?: string
	createdAt!: string
	updatedAt!: string
	devices!: Device[]
	coordinates!: Area

	constructor(dto: BackendInternalEntityLayer) {
		this.id = dto.id || ''
		this.objectId = dto.object_id || ''
		this.floorName = dto.floor_name || ''
		this.devices = dto.devices?.map((d) => new Device(d)) ?? []
		this.coordinates = dto.angles_coordinates?.reduce<Area>((result, layer, _, array) => {
			if (array.length < 4) {
				return result
			}

			if (!layer || layer.lat === undefined || layer.long === undefined) {
				return result
			}

			return [...result, [layer.long, layer.lat]]
		}, []) ?? []
		this.angle = dto.angle || 0
		this.image = dto.image
		this.createdAt = dto.created_at || ''
		this.updatedAt = dto.updated_at || ''
	}
}
