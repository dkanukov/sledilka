import { useEffect } from 'react'
import { message } from 'antd'

import { useLayerEditStore } from '@store'

export const useLayerEdit = (id: string) => {
	const layerStore = useLayerEditStore()

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

	return {
		layerStore,
		handleLayerSave,
	}
}
