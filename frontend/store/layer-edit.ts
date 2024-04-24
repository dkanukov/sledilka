import { create } from 'zustand'
import { Coordinate } from 'ol/coordinate'

import { Device, ObjectLayer, ObjectStorage } from '@models'
import { Area, DeviceKeys, LayerKeys } from '@typos'
import { imageService, objectService } from '@api'

interface LayerEdit{
	layer: ObjectLayer | null
	object: ObjectStorage | null
	device: Device | null
	uploadFile: (file: File) => Promise<void>
	handlePolygonChange: (coordinates: Area, angle: number) => void
	handleLayerUpdate: (layer: ObjectLayer) => Promise<boolean>
	handleSelectedLayerChange: (layerId: string) => void
	handleLayerNameChange: (value: string) => void
	handleLayerCreate: (objectId: string, layer: ObjectLayer) => Promise<void>
	handleSelectedDeviceChange: (key: DeviceKeys, value: string) => void
	handleSelectedDeviceTranslate: (newCoords: { coords: Coordinate; deviceId: string }) => void
	handleDeviceRotating: (newRotation: { rotation: number; deviceId: string }) => void
	handleLayerChange: (key: LayerKeys, value: string) => void
	handleFileUpload: (file: File) => Promise<void>
	updateDevice: (device: Device) => Promise<boolean>
	addNewDevice: (device: Device) => void
	selectDevice: (id: string | null) => void
	createNewLayer: () => void
	removeNewLayer: () => void
	fetchLayerById: (id: string) => Promise<ObjectLayer>
	fetchObjectById: (objectId: string) => Promise<void>
}

export const useLayerEditStore = create<LayerEdit>()((set) => ({
	layer: null,
	object: null,
	device: null,

	uploadFile: async (file: File) => {
		await imageService.uploadImage(file)

		set((state) => {
			if (!state.layer) {
				return {}
			}

			return {
				layer: {
					...state.layer,
					image: file.name,
				},
			}
		})
	},

	handleSelectedLayerUpdate: async (layer: ObjectLayer) => {
		const response = await objectService.updateLayer(layer)

		return response
	},

	handlePolygonChange: (coordinates, angle) => {
		set((state) => {
			if (!state.layer) {
				return {}
			}

			return {
				layer: {
					...state.layer,
					angle,
					coordinates,
				},
			}
		})
	},

	handleLayerNameChange: (value) => set((state) => {
		if (!state.layer) {
			return {}
		}

		return {
			layer: {
				...state.layer,
				floorName: value,
			},
		}
	}),

	handleLayerUpdate: async (layer: ObjectLayer) => {
		const response = await objectService.updateLayer(layer)
		return response
	},

	handleSelectedLayerChange: (layerId) => {
		set((state) => {
			const layerToSelect = state.object?.layers.find((layer) => layer.id === layerId)

			if (!layerToSelect) {
				return {}
			}

			return {
				layer: layerToSelect,
			}
		})
	},

	handleLayerCreate: async (objectId, layer) => {
		const newlayer = await objectService.createLayer(objectId, layer)

		set((state) => {
			if (!state.object) {
				return {}
			}

			const layers = [...state.object.layers.slice(0, -1), newlayer]

			return {
				layer: newlayer,
				object: {
					...state.object,
					layers,
				},
			}
		})
	},

	handleSelectedDeviceTranslate: ({ coords }) => {
		set((state) => {
			if (!state.device || !state.layer) {
				return {}
			}

			const device = state.device
			const devices = state.layer.devices

			device.coordinates = coords as [number, number]

			const deviceIndex = devices.findIndex((d) => d.id === device.id)
			devices[deviceIndex] = device

			return {
				device,
				layer: {
					...state.layer,
					devices: [...devices],
				},
			}
		})
	},

	handleDeviceRotating: ({ rotation }) => {
		set((state) => {
			if (!state.device) {
				return {}
			}

			return {
				device: {
					...state.device,
					angle: rotation,
				},
			}
		})
	},

	handleSelectedDeviceChange: (key, value) => {
		set((state) => {
			if (!state.device || !state.layer) {
				return {}
			}

			let device = state.device
			const devices = state.layer.devices

			if (key === 'lon') {
				device.coordinates[0] = Number(value)
			} else if (key === 'lat') {
				device.coordinates[1] = Number(value)
			} else {
				device = {
					...device,
					[key]: value,
				}
			}

			const deviceIndex = devices.findIndex((d) => d.id === device.id)
			devices[deviceIndex] = device

			return {
				device,
				layer: {
					...state.layer,
					devices: [...devices],
				},
			}
		})
	},

	handleLayerChange: (key, value) => {
		set((state) => {
			if (!state.layer) {
				return {}
			}

			const layer = state.layer

			switch (key) {
			case 'floorName': layer.floorName = value; break
			case 'angle': layer.angle = Number(value); break
			}

			return {
				layer,
			}
		})
	},

	handleFileUpload: async (file) => {
		await imageService.uploadImage(file)
		set((state) => {
			if (!state.layer) {
				return {}
			}

			return {
				layer: {
					...state.layer,
					image: file.name,
				},
			}
		})
	},

	createNewLayer: () => {
		set((state) => {
			if (!state.object) {
				return {}
			}

			const newLayer = new ObjectLayer({
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
			})

			return {
				object: {
					...state.object,
					layers: [...state.object.layers, newLayer],
				},
				layer: newLayer,
			}
		})
	},

	removeNewLayer: () => {
		set((state) => {
			if (!state.object) {
				return {}
			}
			const layers = state.object.layers.slice(0, -1)

			return {
				object: {
					...state.object,
					layers,
				},
				layer: null,
			}
		})
	},

	addNewDevice: (device) => {
		set((state) => {
			if (!state.layer) {
				return {}
			}

			return {
				layer: {
					...state.layer,
					devices: [...state.layer.devices, device],
				},
			}
		})
	},

	updateDevice: async (device) => {
		const response = await objectService.updateDevice(device)
		return response
	},

	selectDevice: (id) => {
		if (!id) {
			set(() => ({ device: null }))
		}

		set((state) => {
			if (!state.layer) {
				return {}
			}

			const deviceToSelect = state.layer.devices.find((device) => device.id === id)

			if (!deviceToSelect) {
				return {}
			}

			return {
				device: deviceToSelect,
			}
		})
	},

	fetchLayerById: async (id) => {
		const layer = await objectService.getLayerById(id)

		set(() => ({
			layer,
		}))

		return layer
	},

	fetchObjectById: async (objectId) => {
		const object = await objectService.getObjectById(objectId)

		set(() => ({
			object,
		}))
	},
}))
