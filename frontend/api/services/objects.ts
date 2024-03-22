import { EntityNewLayer, EntityNewObject } from '../generated/api'
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

export const createLayer = async (objectId: string, newLayer: EntityNewLayer) => {
	const { data } = await CustomedApi.objects.layersCreate(objectId, newLayer)
	return new ObjectLayer(data)
}
