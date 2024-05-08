import { useEffect, useState } from 'react'
import { Coordinate } from 'ol/coordinate'

import { Device, ObjectLayer, ObjectStorage } from '@models'
import { objectService } from '@api'
import { Area, DeviceKeys } from '@typos'

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

	const handleLayerSelect = (id: string) => {
		if (!layer) {
			return
		}

		const deviceToSelect = layer.devices.find((d) => d.id === id)
		if (deviceToSelect) {
			setDevice(deviceToSelect)
		}
	}

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

	const handleDeviceSelect = (id: string) => {
		if (!object) {
			return
		}

		const layerToSelect = object.layers.find((l) => l.id === id)
		if (layerToSelect) {
			setLayer(layerToSelect)
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

		setLayer({
			...layer,
			devices,
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

	const addNewDevice = () => {

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
		handleDeviceSelect,
		handleDeviceChange,
		handleDeviceTranslate,
		flushDevice,
	}
}