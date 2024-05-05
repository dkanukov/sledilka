import { FeatureLike } from 'ol/Feature'
import { Style, Icon, Text, Fill } from 'ol/style'

import { BackendInternalEntityDeviceType } from '../api/generated/api'

import { Device } from '@models'

const ICONS = {
	computerInnactive: '/icon/computer.svg',
	computerSelected: '/icon/computer-selected.svg',
	computerActive: '/icon/computer-active.svg',
	cameraInnactive: '/icon/camera.svg',
	cameraSelected: '/icon/camera-selected.svg',
	cameraActive: '/icon/camera-active.svg',
	printerInnactive: '/icon/printer.svg',
	printerSelected: '/icon/printer-selected.svg',
	printerActive: '/icon/printer-active.svg',
	cluster: '/icon/cluster.svg',
}

const cacheDefault = new Map<string, Style>()
const cacheHovered = new Map<string, Style>()
const cacheCluster = new Map<string, Style>()

export const getComputerSrc = (isActive: boolean) => isActive ? ICONS.computerActive : ICONS.computerInnactive
export const getCameraSrc = (isActive: boolean) => isActive ? ICONS.cameraActive : ICONS.cameraInnactive
export const getPrinterSrc = (isActive: boolean) => isActive ? ICONS.printerActive : ICONS.printerInnactive

const getSrcFunctionByTypesMap: Record<Device['type'], (isActive: boolean) => string> = {
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
	const type: Device['type'] = feature.get('type')
	const rotation = feature.get('rotation')
	const isActive: Device['isActive'] = feature.get('active')
	const src = getSrcFunctionByTypesMap[type](isActive)

	/* const style = cacheDefault.get(featureId)
	if (style && style?.getImage()?.getRotation() === rotation) {
		return style
	} */

	console.log(rotation)
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

export const pointStyleSelected = (cluster: FeatureLike) => {
	const features = cluster.get('features')

	if (features.length > 1) {
		return clusterStyle(cluster)
	}

	const feature = features[0]
	const rotation = feature.get('rotation')
	const type: Device['type'] = feature.get('type')

	let src = ''

	switch (type) {
	case BackendInternalEntityDeviceType.Camera: src = ICONS.cameraSelected; break
	case BackendInternalEntityDeviceType.Printer: src = ICONS.printerSelected; break
	case BackendInternalEntityDeviceType.Computer: src = ICONS.computerSelected; break
	}

	const createdStyle = new Style({
		image: new Icon({
			src,
			rotation,
			opacity: 1,
			scale: 1.1,
		}),
	})

	return createdStyle
}

export const pointStyleHovered = (cluster: FeatureLike) => {
	if (!cluster.get('features')) {
		return
	}

	let feature = cluster.get('features')

	if (feature.length > 1) {
		return clusterStyle(cluster)
	}

	feature = feature[0]
	const featureId = feature.get('id')
	const rotation = feature.get('rotation')
	const type: Device['type'] = feature.get('type')
	const isActive: Device['isActive'] = feature.get('active')
	const style = cacheHovered.get(featureId)
	const src = getSrcFunctionByTypesMap[type](isActive)

	if (style && style.getImage()?.getRotation() === rotation) {
		return style
	}

	// if (status === 'disabled') {
	// 	const cachedStyleHovered = cacheHovered.get(featureId)
	// 	if (cachedStyleHovered && cachedStyleHovered.getImage().getRotation() === rotation) {
	// 		return cachedStyleHovered
	// 	}
	// }

	const createdStyle = new Style({
		image: new Icon({
			src,
			rotation,
			opacity: 1,
			scale: 1.1,
		}),
	})
	cacheHovered.set(featureId, createdStyle)

	return createdStyle
}
