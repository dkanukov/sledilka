import { create } from 'zustand'

import { ObjectsMock } from '@mocks'

interface ObjectsStore {
	objects: {id: string; name: string}[]
	fetchObjects: () => void
}
export const useObjectsStore = create<ObjectsStore>()((set) => ({
	objects: [],
	fetchObjects: () => {
		//todo: fetch objects && mappings
		const data = ObjectsMock
		set(() => ({
			objects: data,
		}))
	},
}))