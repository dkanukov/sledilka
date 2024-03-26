// type Layer struct {
// 	Id                string       `json:"id"`
// 	FloorNumber       string       `json:"floor_number"`
// 	Devices           []Device     `json:"devices"` // тот же вопрос что и с floors
// 	Coordinates       Coordinate   `json:"coordinates"`
// 	ImageUrl          string       `json:"image_url"`
// 	AnglesCoordinates []Coordinate `json:"angles_coordinates"`
// 	Angle             float64      `json:"angle"`
// }
export interface IObjectsMock {
	id: string
	name: string
	address: string
	description: string
	layers: ILayersMock[]
}

export interface ILayersMock {
	id: string
	floorName: string
	coordinates: ICoordinate
	imageUrl: string
	anglesCoordinates: ICoordinate[]
	angle: number
}

export interface ICoordinate {
	x: number
	y: number
}

const LayersMock: ILayersMock[] = [
	{
		id: '1',
		floorName: 'floor 1',
		coordinates: {
			x: 55.751244,
			y: 37.618423,
		},
		imageUrl: '',
		anglesCoordinates: [],
		angle: 0,
	},
]

export const ObjectsMock: IObjectsMock[] = [
	{
		id: '1',
		name: 'object 1',
		address: 'address 1',
		description: 'description 1',
		layers: LayersMock,
	},
]
