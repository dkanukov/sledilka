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
		angles_coordinates: newLayer.coordinates.map((coord) => ({
			long: coord[0],
			lat: coord[1],
		})),
		angle: newLayer.angle,
		floor_name: newLayer.floorName,
		image: newLayer.image,
	})

	return new ObjectLayer(data)
}

export const updateDevice = async (device: Device) => {
	const response = await CustomedApi.devices.devicesPartialUpdate(device.id, {
		ip: device.ip,
		location_y: device.coordinates[0],
		location_x: device.coordinates[1],
		layer_id: device.layerId,
		mac_address: device.macAddress,
		name: device.name,
		type: device.type,
	})

	return response.status === 200
}

export const createDevice = async (device: Device) => {
	const { data } = await CustomedApi.devices.devicesCreate({
		layer_id: device.layerId,
		location_y: device.coordinates[0],
		location_x: device.coordinates[1],
		name: device.name,
		type: device.type,
		//TODO: remove hardcode будет выбор ip + mac address из списка
		mac_address: '7c:50:4e:62:88:1e',
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
		floor_name: layer.floorName,
		image: layer.image,
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
