import { create } from 'zustand'

import { Device, ObjectLayer, ObjectStorage } from '@models'
import { objectService } from '@api'
import { Area } from '@typos'

interface ObjectsStore {
	objects: ObjectStorage[]
	selectedLayer: ObjectLayer | null
	selectedObject: ObjectStorage | null
	handleSelectedLayerChange: (layerString: string) => void
	handlePolygonChange: (coordinates: Area, angle: number) => void
	handleSelectedLayerUpdate: (layer: ObjectLayer) => Promise<boolean>
	fetchObjects: () => Promise<void>
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

	handlePolygonChange: (coordinates, angle) => {
		set((state) => {
			if (!state.selectedLayer) {
				return {}
			}

			return {
				selectedLayer: {
					...state.selectedLayer,
					angle,
					coordinates,
				},
			}
		})
	},

	handleSelectedLayerUpdate: async (layer: ObjectLayer) => {
		const response = await objectService.updateLayer(layer)

		return response
	},

	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},
}))
