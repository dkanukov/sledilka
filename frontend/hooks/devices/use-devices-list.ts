import { useState } from 'react'

import { objectService } from '@api'
import { DeviceExtendedInfo, DeviceFilter, DeviceFilterKeys } from '@typos'

export const useDevicesList = () => {
	const [objectNameById, setObjectNameById] = useState<Record<string, string>>({})
	const [layerByObjectId, setlayerByObjectId] = useState<Record<string, {
		layerId: string
		layerName: string
		devicesCount: number
	}[]>>({})
	const [devices, setDevices] = useState<DeviceExtendedInfo[]>([])
	const [filter, setFilter] = useState<DeviceFilter>({})

	const fetchObjects = async () => {
		const objects = await objectService.getObjects()

		const objectNameById: Record<string, string> = {}
		const layerByObject: Record<string, {
			layerId: string
			layerName: string
			devicesCount: number
		}[]> = {}
		const devices: DeviceExtendedInfo[] = []

		objects.forEach((object) => {
			objectNameById[object.id] = object.name
			layerByObject[object.id] = []

			object.layers.forEach((layer) => {
				layerByObject[object.id].push({
					layerId: layer.id,
					layerName: layer.floorName,
					devicesCount: layer.devices.length,
				})

				layer.devices.forEach((device) => {
					devices.push({
						...device,
						layerName: layer.floorName,
						objectName: object.name,
						objectId: object.id,
					})
				})
			})
		})

		setObjectNameById(objectNameById)
		setlayerByObjectId(layerByObject)
		setDevices(devices)
	}

	const handleFilterChange = (key: DeviceFilterKeys, value: string | undefined) => {
		const newFilters = { ...filter }
		if (key === 'objectId') {
			newFilters.layerId = undefined
		}

		setFilter({
			...newFilters,
			[key]: value ? value : undefined,
		})
	}

	return {
		filter,
		devices,
		layerByObjectId,
		objectNameById,
		handleFilterChange,
		fetchObjects,
	}
}
