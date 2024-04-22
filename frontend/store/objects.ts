import { create } from 'zustand'

import { Device, ObjectLayer, ObjectStorage } from '@models'
import { objectService } from '@api'

interface ObjectsStore {
	objects: ObjectStorage[]
	selectedLayer: ObjectLayer | null
	selectedDevice: Device | null
	handleSelectedLayerChange: (layerString: string) => void
	handleDeviceSelect: (id: string) => void
	handleSelectedDeviceChange: (key: string, value: string) => void
	updateDevice: (device: Device) => Promise<void>
	flushSelectedDevice: () => void
	fetchObjects: () => Promise<void>
}

export const useObjectsStore = create<ObjectsStore>()((set) => ({
	objects: [],
	selectedLayer: null,
	selectedDevice: null,

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

	handleDeviceSelect: (id) => {
		set((state) => {
			if (!state.selectedLayer) {
				return {}
			}

			const device = state.selectedLayer.devices.find((device) => device.id === id)

			if (!device) {
				return {}
			}

			return {
				selectedDevice: device,
			}
		})
	},

	flushSelectedDevice: () => {
		set(() => ({
			selectedDevice: null,
		}))
	},

	handleSelectedDeviceChange: (key, value) => {
		set((state) => {
			if (!state.selectedDevice) {
				return {}
			}

			return {
				selectedDevice: {
					...state.selectedDevice,
					[key]: value,
				},
			}
		})
	},

	updateDevice: async (device) => {
		await objectService.updateDevice(device)
	},

	fetchObjects: async () => {
		const objects = await objectService.getObjects()

		set(() => ({
			objects,
		}))
	},
}))
