import { useState } from 'react'

import { ObjectLayer } from '@models'
import { imageService, objectService } from '@api'
import { Area } from '@typos'

export const useCreateNewLayer = () => {
	const [newLayer, setNewLayer] = useState<ObjectLayer | null>(null)

	const initNewLayer = (objectId: string) => {
		setNewLayer(new ObjectLayer({
			object_id: objectId,
			floor_name: 'Новый слой',
			image: '',
			angle: 0,
			angles_coordinates: [
				{
					long: 37.61709143678161,
					lat: 55.75573442528736,
				},
				{
					long: 37.622838563218394,
					lat: 55.75573442528736,
				},
				{
					long: 37.622838563218394,
					lat: 55.753435574712626,
				},
				{
					long: 37.61709143678161,
					lat: 55.753435574712626,
				},
			],
		}))
	}

	const handleLayerNameChange = (value: string) => {
		if (!newLayer) {
			return
		}

		setNewLayer({
			...newLayer,
			floorName: value,
		})
	}

	const handleFileUpload = async (file: File) => {
		if (!newLayer) {
			return
		}

		await imageService.uploadImage(file)
		setNewLayer({
			...newLayer,
			image: file.name,
		})
	}

	const handleSaveNewLayer = async () => {
		if (!newLayer) {
			return
		}

		return await objectService.createLayer(newLayer)
	}

	const handleLayerTranslate = (coordinates: Area, angle: number) => {
		if (!newLayer) {
			return
		}

		setNewLayer({
			...newLayer,
			angle,
			coordinates,
		})
	}

	const flushNewLayer = () => {
		setNewLayer(null)
	}

	return {
		newLayer,
		initNewLayer,
		handleSaveNewLayer,
		flushNewLayer,
		handleLayerNameChange,
		handleFileUpload,
		handleLayerTranslate,
	}
}
