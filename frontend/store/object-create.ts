import { create } from 'zustand'

import { EntityNewLayer, EntityNewObject } from '../api/generated/api'

import { objectService } from '@api'
import { ObjectStorage } from '@models'

interface ObjectCreateStore {
	createdObject: ObjectStorage | null
	createNewObject: (objectData: EntityNewObject) => Promise<void>
	createNewLayer: (objectId: string, layerData: EntityNewLayer) => Promise<void>
}

export const useObjectCreateStore = create<ObjectCreateStore>()((set) => ({
	createdObject: null,
	createNewObject: async (objectData: EntityNewObject) => {
		const newObject = await objectService.createObject(objectData)
		set(({
			createdObject: newObject,
		}))
	},
	createNewLayer: async (objectId: string, layerData: EntityNewLayer) => {
		const newLayer = await objectService.createLayer(objectId, layerData)

		set((state) => {
			if (!state.createdObject) {
				return {
					createdObject: null,
				}
			}

			return {
				createdObject: {
					...state.createdObject,
					layers: [newLayer],
				},
			}
		})
	},
}))
