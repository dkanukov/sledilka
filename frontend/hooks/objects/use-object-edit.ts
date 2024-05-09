import { useEffect, useState } from 'react'
import { Coordinate } from 'ol/coordinate'
import { message } from 'antd'

import { Device, ObjectLayer, ObjectStorage } from '@models'
import { imageService, objectService } from '@api'
import { Area, DeviceKeys } from '@typos'
import { getRectCenter } from '@helpers'

export const useObjectEdit = (objectId: string) => {
	const [object, setObject] = useState<ObjectStorage | null>(null)
	const [layer, setLayer] = useState<ObjectLayer | null>(null)
	const [device, setDevice] = useState<Device | null>(null)

	useEffect(() => {
		const fetch = async () => {
			const obj = await objectService.getObjectById(objectId)
			setObject(obj)
		}

		fetch()
	}, [])

	const handleLayerTranslate = (coordinates: Area, angle: number) => {
		if (!layer) {
			return
		}

		setLayer({
			...layer,
			angle,
			coordinates,
		})
	}

	const handleLayerUpdate = async () => {
		if (!layer) {
			return
		}

		await objectService.updateLayer(layer)
	}

	const handleLayerSelect = (id: string) => {
		if (!object) {
			return
		}

		const layerToSelect = object.layers.find((l) => l.id === id)
		if (layerToSelect) {
			setLayer(layerToSelect)
		}
	}

	const handleFileUpload = async (file: File) => {
		if (!layer) {
			return
		}

		await imageService.uploadImage(file)
		setLayer({
			...layer,
			image: file.name,
		})
	}

	const handleDeviceSelect = (id: string) => {
		if (!layer) {
			return
		}

		const deviceToSelect = layer.devices.find((d) => d.id === id)
		if (deviceToSelect) {
			setDevice(deviceToSelect)
		}
	}

	const handleDeviceChange = (key: DeviceKeys, value: string) => {
		if (!device || !layer) {
			return
		}

		let newDevice = device
		const devices = layer.devices
		if (key === 'lon') {
			newDevice.coordinates[0] = Number(value)
		} else if (key === 'lat') {
			newDevice.coordinates[1] = Number(value)
		} else {
			newDevice = {
				...device,
				[key]: value,
			}
		}

		const deviceIndex = devices.findIndex((d) => d.id === device.id)
		devices[deviceIndex] = newDevice

		console.log(newDevice)
		setLayer({
			...layer,
			devices: [...devices],
		})
		setDevice(newDevice)
	}

	const handleDeviceTranslate = (newCoords: { coords: Coordinate; deviceId: string }) => {
		if (!device || !layer) {
			return
		}

		const newDevice = device
		const devices = layer.devices

		newDevice.coordinates = newCoords.coords as [number, number]
		const deviceIndex = devices.findIndex((d) => d.id === device.id)
		devices[deviceIndex] = newDevice

		setLayer({
			...layer,
			devices,
		})
		setDevice(newDevice)
	}

	const handleAddNewDevice = async () => {
		if (!layer) {
			return
		}

		const center = getRectCenter(layer.coordinates)

		const newDevice = await objectService.createDevice(new Device({
			name: 'Новое устройство',
			layer_id: layer.id,
			location_y: center[0],
			location_x: center[1],

		}))

		if (!newDevice) {
			message.error({ content: 'Не удалось создать устройство' })
			return
		}

		message.success({ content: 'Устройство создано' })

		setLayer({
			...layer,
			devices: [...layer.devices, newDevice],
		})
		setDevice(newDevice)
	}

	const handleDeviceSave = async () => {
		if (!device) {
			return
		}

		const response = await objectService.updateDevice(device)

		if (!response) {
			message.error({ content: 'Не удалось обновить устройство' })
		}

		message.success({ content: 'Устройство обновлено' })
	}

	const addLayer = (layer: ObjectLayer) => {
		if (!object) {
			return
		}

		setObject({
			...object,
			layers: [...object.layers, layer],
		})
	}

	const flushDevice = () => {
		setDevice(null)
	}

	return {
		object,
		layer,
		device,
		handleLayerSelect,
		handleLayerTranslate,
		handleLayerUpdate,
		handleDeviceSelect,
		handleDeviceChange,
		handleDeviceTranslate,
		handleAddNewDevice,
		handleDeviceSave,
		handleFileUpload,
		addLayer,
		flushDevice,
	}
}