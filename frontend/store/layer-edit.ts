import { create } from 'zustand'

import { ObjectLayer } from '@models'
import { Area } from '@typos'
import { objectService } from '@api'

interface LayerEdit{
	layer: ObjectLayer | null
	handlePolygonChange: (coordinates: Area, angle: number) => void
	handleLayerUpdate: (layer: ObjectLayer) => Promise<boolean>
}

export const useLayerEditStore = create<LayerEdit>()((set) => ({
	layer: null,

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

	handleLayerUpdate: async (layer: ObjectLayer) => {
		const response = await objectService.updateLayer(layer)

		return response
	},
}))
