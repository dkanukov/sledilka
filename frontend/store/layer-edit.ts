import { create } from 'zustand'

import { ObjectLayer, ObjectStorage } from '@models'
import { Area } from '@typos'
import { objectService } from '@api'

interface LayerEdit{
	layer: ObjectLayer | null
	object: ObjectStorage | null
	handlePolygonChange: (coordinates: Area, angle: number) => void
	handleLayerUpdate: (layer: ObjectLayer) => Promise<boolean>
	handleSelectedLayerChange: (layerId: string) => void
	createNewLayer: () => void
	fetchLayerById: (id: string) => Promise<ObjectLayer>
	fetchObjectById: (objectId: string) => Promise<void>
}

export const useLayerEditStore = create<LayerEdit>()((set) => ({
	layer: null,
	object: null,

	handleSelectedLayerUpdate: async (layer: ObjectLayer) => {
		const response = await objectService.updateLayer(layer)

		return response
	},

	handlePolygonChange: (coordinates, angle) => {
		set((state) => {
			if (!state.layer) {
				return {}
			}

			return {
				layer: {
					...state.layer,
					angle,
					coordinates,
				},
			}
		})
	},

	handleLayerUpdate: async (layer: ObjectLayer) => {
		const response = await objectService.updateLayer(layer)
		return response
	},

	handleSelectedLayerChange: (layerId) => {
		set((state) => {
			const layerToSelect = state.object?.layers.find((layer) => layer.id === layerId)

			if (!layerToSelect) {
				return {}
			}

			return {
				layer: layerToSelect,
			}
		})
	},

	createNewLayer: () => {
		set((state) => {
			if (!state.object) {
				return {}
			}

			const newLayer = new ObjectLayer({
				floor_name: 'Новый слой',
				angle: 0,
				angles_coordinates: [
					{
						long: 37.61709143678161,
						lat: 55.75573442528736,
					},
					{
						long: 37.622838563218394,
						lat: 55.75573442528736,
					},
					{
						long: 37.622838563218394,
						lat: 55.753435574712626,
					},
					{
						long: 37.61709143678161,
						lat: 55.753435574712626,
					},
				],
			})

			return {
				object: {
					...state.object,
					layers: [...state.object.layers, newLayer],
				},
				layer: newLayer,
			}
		})
	},

	fetchLayerById: async (id) => {
		const layer = await objectService.getLayerById(id)

		set(() => ({
			layer,
		}))

		return layer
	},

	fetchObjectById: async (objectId) => {
		const object = await objectService.getObjectById(objectId)

		set(() => ({
			object,
		}))
	},
}))
