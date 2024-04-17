import { create } from 'zustand'

import { ObjectLayer, ObjectStorage } from '@models'
import { Area } from '@typos'
import { imageService, objectService } from '@api'

interface LayerEdit{
	layer: ObjectLayer | null
	object: ObjectStorage | null
	uploadFile: (file: File) => Promise<void>
	handlePolygonChange: (coordinates: Area, angle: number) => void
	handleLayerUpdate: (layer: ObjectLayer) => Promise<boolean>
	handleSelectedLayerChange: (layerId: string) => void
	handleLayerNameChange: (value: string) => void
	handleLayerCreate: (objectId: string, layer: ObjectLayer) => Promise<void>
	createNewLayer: () => void
	removeNewLayer: () => void
	fetchLayerById: (id: string) => Promise<ObjectLayer>
	fetchObjectById: (objectId: string) => Promise<void>
}

export const useLayerEditStore = create<LayerEdit>()((set) => ({
	layer: null,
	object: null,

	uploadFile: async (file: File) => {
		await imageService.uploadImage(file)

		set((state) => {
			if (!state.layer) {
				return {}
			}

			return {
				layer: {
					...state.layer,
					image: file.name,
				},
			}
		})
	},

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

	handleLayerNameChange: (value) => set((state) => {
		if (!state.layer) {
			return {}
		}

		return {
			layer: {
				...state.layer,
				floorName: value,
			},
		}
	}),

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

	handleLayerCreate: async (objectId, layer) => {
		const newlayer = await objectService.createLayer(objectId, layer)

		set((state) => {
			if (!state.object) {
				return {}
			}

			const layers = [...state.object.layers.slice(0, -1), newlayer]

			return {
				layer: newlayer,
				object: {
					...state.object,
					layers,
				},
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

	removeNewLayer: () => {
		set((state) => {
			if (!state.object) {
				return {}
			}
			const layers = state.object.layers.slice(0, -1)

			console.log(layers)

			return {
				object: {
					...state.object,
					layers,
				},
				layer: null,
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
