import { v4 as uuidv4 } from 'uuid'

interface LocationDto {
	lan: number
	lot: number
	address: string
	description: string
}

export class Location {
	id!: string
	coordinates!: [number, number]
	address!: string
	description!: string

	constructor(dto: LocationDto) {
		Object.assign(this, dto)
		this.coordinates = [dto.lan, dto.lot]
		this.id = uuidv4()
	}
}
