import { Vector as VectorSource, Cluster as ClusterSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { GeoJSON } from 'ol/format'
import { Feature } from 'ol'

import { clusterStyle, getScaleByResolution, pointStyleDefault } from '@helpers'

const CLUSTER_DISTANCE = 25
const CLUSTER_MIN_DISTANCE = 15

export class PointsLayer extends VectorLayer<VectorSource> {
	private vectorSource: VectorSource
	private clusterSource: ClusterSource

	constructor(features: Feature[], clusteringEnabled = true) {
		const vectorSource = new VectorSource({
			format: new GeoJSON({
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
			}),
			features,
		})

		const source = new ClusterSource({
			source: vectorSource,
			distance: clusteringEnabled ? CLUSTER_DISTANCE : 0,
			minDistance: CLUSTER_MIN_DISTANCE,
		})

		super({
			source,
			visible: true,
			zIndex: 999,
			style: (feature, resolution) => {
				const clusterSize = feature.get('features').length
				if (clusterSize === 1) {
					const scale = getScaleByResolution(resolution)
					const style = pointStyleDefault(feature)
					const image = style.getImage()

					image?.setScale(scale)

					return style
				}
				return clusterStyle(feature)
			},
		})
		this.vectorSource = vectorSource
		this.clusterSource = source
	}

	getVectorSource() {
		return this.vectorSource
	}

	disableClustering() {
		this.clusterSource.setDistance(0)
	}

	enableClustering() {
		this.clusterSource.setDistance(CLUSTER_DISTANCE)
	}
}
