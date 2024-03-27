import { create } from 'zustand'

import { ObjectLayer, ObjectStorage } from '@models'
import { objectService, imageService } from '@api'

interface ObjectsStore {
	objects: ObjectStorage[]
	selectedLayer: ObjectLayer | null
	selectedObject: ObjectStorage | null
	handleSelectedLayerChange: (layerString: string) => void
	handleAddLayer: (objectId: string) => void
	handleSelectedLayerTransform: (southWest:[number, number], northEast: [number, number]) => void
	handleUploadImage: (file: File) => Promise<void>
	handleSelectedFloorNameChange: (value: string) => void
	fetchObjects: () => Promise<void>
	createNewLayer: (objectId: string, newLayer: ObjectLayer) => Promise<string>
}
export const useObjectsStore = create<ObjectsStore>()((set) => ({
	objects: [],
	selectedLayer: null,
	selectedObject: null,

	handleSelectedLayerChange: (layerKey: string) => {
		set((state) => {

			const layerById = state.objects.reduce<Record<string, ObjectLayer>>((acc, cur) => {
				cur.layers.forEach((layer) => {
					acc[layer.id] = layer
				})

				return acc
			}, {})

			return {
				selectedLayer: layerById[layerKey],
			}
		})
	},

	handleAddLayer: (objectId) => {
		set((state) => {
			const object = state.objects.find((obj) => obj.id === objectId)
			if (!object) {
				return state
			}

			const existingLayer = object.layers[0]
			const newLayer = new ObjectLayer({
				object_id: objectId,
				floor_name: '',
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
				selectedObject: object,
				selectedLayer: newLayer,
			}
		})
	},

	handleSelectedLayerTransform: (southWest, northEast) => {
		set((state) => {
			if (!state.selectedLayer) {
				return state
			}

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

	handleSelectedFloorNameChange: (value) => {
		console.log(value)
		set((state) => {
			if (!state.selectedLayer) {
				return state
			}

			return {
				selectedLayer: {
					...state.selectedLayer,
					floorName: value,
				},
			}
		})
	},

	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},

	createNewLayer: async (objectId, newLayer) => {
		const id = await objectService.createLayer(objectId, newLayer)

		return id ?? ''
	},
}))
