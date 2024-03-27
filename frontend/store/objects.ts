import { create } from 'zustand'

import { ObjectLayer, ObjectStorage } from '@models'
import { objectService, imageService } from '@api'

interface ObjectsStore {
	objects: ObjectStorage[]
	selectedLayer: ObjectLayer | null
	selectedObject: ObjectStorage | null
	handleSelectedLayerChange: (layerString: string) => void
	handleAddLayer: () => void
	handleSelectedLayerTransform: (southWest:[number, number], northEast: [number, number]) => void
	handleUploadImage: (file: File) => Promise<void>
	fetchObjects: () => Promise<void>
}
export const useObjectsStore = create<ObjectsStore>()((set) => ({
	objects: [],
	selectedLayer: null,
	selectedObject: null,

	handleSelectedLayerChange: (layerKey: string) => {
		set((state) => {
			let objectToSelect: ObjectStorage | null = null

			const layerById = state.objects.reduce<Record<string, ObjectLayer>>((acc, cur) => {
				cur.layers.forEach((layer) => {
					if (layer.objectId === cur.id) {
						objectToSelect = cur
					}
					acc[layer.id] = layer
				})

				return acc
			}, {})
			console.log(objectToSelect)
			return {
				selectedLayer: layerById[layerKey],
				selectedObject: objectToSelect,
			}
		})
	},

	handleAddLayer: () => {
		set((state) => {
			if (!state.selectedObject) {
				return state
			}

			const existingLayer = state.selectedObject.layers[0]
			const newLayer = new ObjectLayer({
				angles_coordinates: [
					{
						x: existingLayer.southWest[0],
						y: existingLayer.southWest[1],
					},
					{
						x: existingLayer.northEast[0],
						y: existingLayer.northEast[1],
					},
				],
			})

			return {
				selectedObject: {
					...state.selectedObject,
					layers: [...state.selectedObject.layers, newLayer],
				},
				selectedLayer: newLayer,
			}
		})
	},

	handleSelectedLayerTransform: (southWest, northEast) => {
		set((state) => {
			if (!state.selectedLayer) {
				return state
			}

			console.log(southWest, northEast)

			return {
				selectedLayer: {
					...state.selectedLayer,
					southWest,
					northEast,
				},
			}
		})
	},

	handleUploadImage: async (file) => {
		const response = await imageService.uploadImage(file)
		if (response.status === 200) {
			set((state) => {
				if (!state.selectedLayer) {
					return state
				}
				return {
					selectedLayer: {
						...state.selectedLayer,
						image: file.name,
					},
				}
			})
		}
	},

	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},
}))
