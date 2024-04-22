import { useEffect } from 'react'
import { message } from 'antd'

import { useCustomRouter } from '@hooks'
import { useLayerEditStore } from '@store'
import { Device } from '@models'
import { getRectCenter } from '@helpers'
import { objectService } from '@api'

export const useLayerEdit = (id: string) => {
	const layerStore = useLayerEditStore()
	const { customRouter } = useCustomRouter()

	useEffect(() => {
		const fetchLayerById = async () => {
			const { objectId } = await layerStore.fetchLayerById(id)
			await layerStore.fetchObjectById(objectId)
		}

		fetchLayerById().catch(() => {})
	}, [])

	const handleLayerSave = async () => {
		if (!layerStore.layer) {
			return
		}

		const response = await layerStore.handleLayerUpdate(layerStore.layer)

		if (response) {
			await message.success({ content: 'Слой сохранен' })
			return
		}

		await message.error({ content: 'Слой не был сохранен' })
	}

	const handleLayerChange = (id: string) => {
		layerStore.handleSelectedLayerChange(id)
		customRouter.push({
			path: `/admin/${id}`,
		})
	}

	const handleAddDevice = async () => {
		if (!layerStore.layer) {
			return
		}

		const layerCenter = getRectCenter(layerStore.layer.coordinates)

		const device = await objectService.createDevice(new Device({
			name: 'новое устройство',
			layer_id: layerStore.layer?.id,
			location_y: layerCenter[0],
			location_x: layerCenter[1],
		}))

		layerStore.addNewDevice(device)
	}

	return {
		layerStore,
		handleLayerSave,
		handleLayerChange,
		handleAddDevice,
	}
}
