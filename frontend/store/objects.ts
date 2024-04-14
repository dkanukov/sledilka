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
		console.log(coordinates)
		console.log(angle)
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

	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},
}))
