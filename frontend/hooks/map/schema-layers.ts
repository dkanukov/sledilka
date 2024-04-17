import GeoLayer from 'ol-ext/layer/GeoImage'
import GeoImage from 'ol-ext/source/GeoImage'

import { Point } from '@typos'

type SchemeLayerSettings = {
	url: string
	center: Point
	rotation: number
	scale: [number, number]
}

export class SchemeLayer extends GeoLayer {
	constructor(settings: SchemeLayerSettings) {
		const source = new GeoImage({
			url: settings.url,
			imageCenter: settings.center,
			imageRotate: settings.rotation,
			projection: 'EPSG:3857',
		})

		source.setScale(settings.scale)

		super({
			name: 'GeoImage',
			source,
			visible: true,
			zIndex: 998,
		})
	}
}
