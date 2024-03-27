import { EntityNewObject } from '../generated/api'
import CustomedApi from '../generated/customed-api'

import { Device, ObjectLayer, ObjectStorage } from '@models'

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
				x: newLayer.southWest[0],
				y: newLayer.southWest[1],
			}, {
				x: newLayer.northEast[0],
				y: newLayer.northEast[1],
			},
		],
		floor_name: newLayer.floorName,
		image: newLayer.image,
	})

	return data.id
}

export const updateDevice = async (device: Device) => {
	const { data } = await CustomedApi.devices.devicesPartialUpdate(device.id, {
		location_x: device.locationX,
		location_y: device.locationY,
	})

	return new Device(data)
}
