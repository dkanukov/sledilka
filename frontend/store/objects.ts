import { create } from 'zustand'

import { ObjectStorage } from '@models'
import { objectService } from '@api'

interface ObjectsStore {
	objects: ObjectStorage[]
	selectedObject: null | ObjectStorage
	handleSelectedStorageChange: (objectStorage: ObjectStorage) => void
	fetchObjects: () => Promise<void>
}
export const useObjectsStore = create<ObjectsStore>()((set) => ({
	objects: [],
	selectedObject: null,
	handleSelectedStorageChange: (objectStorage: ObjectStorage) => {
		set(() => ({
			selectedObject: objectStorage,
		}))
	},
	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},
}))
