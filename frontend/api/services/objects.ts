import { EntityNewObject } from '../generated/api'
import CustomedApi from '../generated/customed-api'

import { ObjectLayer, ObjectStorage } from '@models'

export const getObjects = async () => {
	const { data } = await CustomedApi.objects.objectsList()

	return data.map((object) => new ObjectStorage(object))
}

export const createObject = async (newObject: EntityNewObject) => {
	const { data } = await CustomedApi.objects.objectsCreate(newObject)
	return new ObjectStorage(data)
}

export const createLayer = async (objectId: string, newLayer: ObjectLayer) => {
	const { data } = await CustomedApi.objects.layersCreate(objectId, {
		angles_coordinates: [
			{
				x: newLayer.lan[0],
				y: newLayer.lan[1],
			}, {
				x: newLayer.lot[0],
				y: newLayer.lot[1],
			},
		],
		floor_name: 'test',
		image: newLayer.image,
	})

	return data.id
}
