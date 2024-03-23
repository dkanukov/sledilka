import { create } from 'zustand'

import { EntityNewLayer, EntityNewObject } from '../api/generated/api'

import { imageService, objectService } from '@api'
import { ObjectLayer, ObjectStorage } from '@models'

interface ObjectCreateStore {
	createdObject: ObjectStorage | null
	// createdLayer: ObjectLayer | null
	createNewObject: (objectData: EntityNewObject) => Promise<void>
	createNewLayer: (objectId: string, layer: ObjectLayer) => Promise<{
		success: boolean
		id: string
	}>
	uploadImage: (file: File) => Promise<boolean>
	whenLayerLanLotChange: (lan:[number, number], lot: [number, number]) => void
}

export const useObjectCreateStore = create<ObjectCreateStore>()((set) => ({
	createdObject: null,
	// createdLayer: null,
	createNewObject: async (objectData) => {
		const newObject = await objectService.createObject(objectData)
		set(({
			createdObject: newObject,
		}))
	},
	whenLayerLanLotChange: (lan, lot) => {
		set((state) => {
			if (!state.createdObject || !state.createdObject.layers[0]) {
				return state
			}

			return {
				createdObject: {
					...state.createdObject,
					layers: [state.createdObject.layers[0] = {
						...state.createdObject.layers[0],
						lan: lan,
						lot: lot,
					}],
				},
			}

		})
	},
	createNewLayer: async (objectId, layer) => {
		const response = await objectService.createLayer(objectId, layer)
		return {
			success: Boolean(response),
			id: response ?? '',
		}
	},
	uploadImage: async (file) => {
		const { status } = await imageService.uploadImage(file)

		const isOk = status === 200

		if (isOk) {
			set((state) => {
				if (!state.createdObject) {
					return state
				}

				return {
					createdObject: {
						...state.createdObject,
						layers: [new ObjectLayer({
							object_id: state.createdObject.id,
							image: file.name,
							angles_coordinates: [
								{
									x: 40.6820204778591,
									y: -74.33,
								},
								{
									x: 41.6820209778591,
									y: -73.118464,
								},
							],
						})],
					},
				}
			})
		}

		return isOk
	},
}))
