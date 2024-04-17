import { FeatureLike } from 'ol/Feature'
import { Style, Icon, Text, Fill } from 'ol/style'

import { Device } from '@models'

const ICONS = {
	computer: '/icon/computer.svg',
	camera: '/icon/camera.svg',
	printer: '/icon/printer.svg',
	cluster: '/icon/cluster.svg',
}

const cacheDefault = new Map<string, Style>()
const cacheHovered = new Map<string, Style>()
const cacheCluster = new Map<string, Style>()

export const getComputerSrc = () => ICONS.computer
export const getCameraSrc = () => ICONS.camera
export const getPrinterSrc = () => ICONS.printer

const getSrcFunctionByTypesMap: Record<Device['type'], () => string> = {
	computer: getComputerSrc,
	camera: getCameraSrc,
	printer: getPrinterSrc,
}

export const pointStyleDefault = (cluster: FeatureLike) => {
	const feature = cluster.get('features')[0]

	if (feature.length > 1) {
		return clusterStyle(cluster)
	}

	const featureId = feature.get('id')
	const status: Device['type'] = feature.get('type')
	const rotation = feature.get('rotation')
	const src = getSrcFunctionByTypesMap[status]()

	const style = cacheDefault.get(featureId)
	if (style && style?.getImage()?.getRotation() === rotation) {
		return style
	}

	const createdStyle = new Style({
		image: new Icon({
			src,
			rotation,
			opacity: 1,
			scale: 1,
		}),
	})
	cacheDefault.set(featureId, createdStyle)

	return createdStyle
}

export const clusterStyle = (cluster: FeatureLike) => {
	const clusterSize = cluster.get('features').length.toString()

	const cachedCluster = cacheCluster.get(clusterSize)
	if (cachedCluster) {
		return cachedCluster
	}

	const style = new Style({
		image: new Icon({
			anchor: [0, 20],
			anchorXUnits: 'pixels',
			anchorYUnits: 'pixels',
			src: ICONS.cluster,
			size: [40, 40],
		}),
		text: new Text({
			font: '17px Roboto,sans-serif',
			fill: new Fill({
				color: '#000',
			}),
			offsetY: -2,
			offsetX: 20,
			textAlign: 'center',
			text: clusterSize,
		}),
	})

	cacheCluster.set(clusterSize, style)
	return style
}
