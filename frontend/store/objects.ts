import { create } from 'zustand'

import { Device, ObjectLayer, ObjectStorage } from '@models'
import { objectService } from '@api'

interface ObjectsStore {
	objects: ObjectStorage[]
	selectedLayer: ObjectLayer | null
	selectedObject: ObjectStorage | null
	handleSelectedLayerChange: (layerString: string) => void
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

	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},
}))
