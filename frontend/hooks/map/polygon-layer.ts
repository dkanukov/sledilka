import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Stroke, Style } from 'ol/style'
import { Feature } from 'ol'
import { Polygon } from 'ol/geom'

import { Area } from '@typos'

export class PolygonLayer extends VectorLayer<VectorSource> {
	public readonly feature: any

	public rotation = 0

	constructor(coordinates: Area) {
		const feature = new Feature(new Polygon([coordinates]))

		const source = new VectorSource()
		source.addFeature(feature)

		const style = new Style({
			stroke: new Stroke({
				color: 'blue',
				width: 3,
			}),
		})

		super({
			source,
			style: [style],
			zIndex: 999,
			visible: true,
		})

		this.feature = feature
	}
}
