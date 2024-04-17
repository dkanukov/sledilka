import { useLayerEditStore } from '@store'

export const useCreateNewLayer = () => {
	const layerStore = useLayerEditStore()

	const createNewLayer = () => {
		layerStore.createNewLayer()
	}

	return {
		createNewLayer,
	}
}
