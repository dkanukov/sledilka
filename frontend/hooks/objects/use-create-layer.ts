import { useLayerEditStore } from '@store'

export const useCreateNewLayer = () => {
	const layerStore = useLayerEditStore()

	const createNewLayer = () => {
		layerStore.createNewLayer()
	}

	const removeNewLayer = () => {
		layerStore.removeNewLayer()
	}

	const handleLayerNameChange = (value: string) => {
		layerStore.handleLayerNameChange(value)
	}

	const handleFileUpload = async (file: File) => {
		await layerStore.uploadFile(file)
	}

	const createLayer = async () => {
		if (!layerStore.layer || !layerStore.object) {
			return
		}

		await layerStore.handleLayerCreate(layerStore.object.id, layerStore.layer)
	}

	return {
		createNewLayer,
		removeNewLayer,
		handleLayerNameChange,
		handleFileUpload,
		createLayer,
		layer: layerStore.layer,
	}
}
