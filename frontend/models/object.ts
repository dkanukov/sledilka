import { EntityLayer, EntityObject } from '../api/generated/api'

export class ObjectStorage {
	id!: string
	name!: string
	address!: string
	description!: string
	layers!: ObjectLayer[]
	updatedAt!: string
	createdAt!: string

	constructor(dto: EntityObject) {
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
	angle?: number
	coordinateX: number
	coordinateY: number
	image?: string
	createdAt!: string
	updatedAt!: string
	// devices?: EntityDevice[]

	constructor(dto: EntityLayer) {
		this.id = dto.id || ''
		this.objectId = dto.object_id || ''
		this.floorName = dto.floor_name || ''
		this.angle = dto.angle
		this.coordinateX = dto.coordinate_x || 0
		this.coordinateY = dto.coordinate_y || 0
		this.image = dto.image
		this.createdAt = dto.created_at || ''
		this.updatedAt = dto.updated_at || ''
	}
}
