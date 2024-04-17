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
	/* const { data } = await CustomedApi.objects.layersCreate(objectId, {
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

	return data.id */
}

export const updateDevice = async (device: Device) => {
	const { data } = await CustomedApi.devices.devicesPartialUpdate(device.id, {
		location_x: device.locationX,
		location_y: device.locationY,
	})

	return new Device(data)
}

export const updateLayer = async (layer: ObjectLayer) => {
	const response = await CustomedApi.objects.layersPartialUpdate(layer.objectId, layer.id, {
		angle: layer.angle,
		angles_coordinates: layer.coordinates.map((area) => ({
			long: area[0],
			lat: area[1],
		})),
		// floor_name?: string;
		// image?: string;
	})

	return response.status === 200
}

export const getLayerById = async (id: string) => {
	const { data } = await CustomedApi.layers.layersDetail(id)

	return new ObjectLayer(data)
}

export const getObjectById = async (objectId: string) => {
	const { data } = await CustomedApi.objects.objectsDetail(objectId)

	return new ObjectStorage(data)
}
