import { useRef, useState } from 'react'
import { Collection, Feature, Map as MapOl, View } from 'ol'
import { fromLonLat, toLonLat, transform } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { Layer } from 'ol/layer'
import { message } from 'antd'
//@ts-expect-error no types
import Transform from 'ol-ext/interaction/Transform'
import { Point } from 'ol/geom'
import { Select } from 'ol/interaction'
import { click, pointerMove } from 'ol/events/condition'
import { boundingExtent } from 'ol/extent'
import { fromExtent } from 'ol/geom/Polygon'

import { MapLayer, PointsLayer, PolygonLayer, SchemeLayer } from '.'

import { degreeToRadian, getImgParams, getRectCenter, getScaleByResolution, loadImage, pointStyleHovered, pointStyleSelected, radianToDegree } from '@helpers'
import { Area } from '@typos'
import { Device } from '@models'

interface BasicTransformEvent {
	coordinate: Coordinate
	feature: Feature
	features: Collection<Feature>
	pixel: [number, number]
}

interface RotatingTransformEvent extends BasicTransformEvent {
	angle: number
}

const PIXEL_RATIO = 2
const LON_RATIO = 0.05
const LAT_RATIO = 0.02
const DEFAULT_CENTER = fromLonLat([37.619965, 55.754585])
const DEFAULT_ZOOM = 17.4
const DEFAULT_ROTATION = 0
const CAMERA_HIT_ZONE_PX = 10
const CLUSTER_EXTENT_SCALE = 10

type LayerKeys = 'tile' | 'points' | 'scheme' | 'polygon'

export const useMap = ({
	onPolygonChange,
	onFeatureSelect,
	clustering,
}: {
	clustering?: boolean
	onPolygonChange?: (coordinates: Area, angle: number) => void
	onFeatureSelect?: (e: any) => void
}) => {
	const mapRootElement = useRef<HTMLDivElement | null>(null)
	const [map, setMap] = useState<MapOl | null>(null)
	const layersDict = useRef<Map<LayerKeys, Layer>>(new Map())
	const polygonTransform = useRef<typeof Transform>()
	const polygonLayer = useRef<PolygonLayer | null>(null)
	const pointsLayer = useRef<PointsLayer | null>(null)
	const featureClick = useRef<Select | null>(null)
	const featurePointerMove = useRef<Select | null>(null)
	const transformDevice = new Transform({
		features: layersDict.current.get('points'),
		rotate: true,
		translate: true,
		scale: false,
		pointRadius: 0,
		translateFeature: true,
		filter: (features: Feature) => {
			const feature = features.get('features')
			return Boolean(feature) && !(feature.length > 1)
		},
	})

	const initializeMap = (center?: Coordinate) => {
		if (!mapRootElement.current) {
			return
		}

		const view = new View({
			center: center || DEFAULT_CENTER,
			zoom: DEFAULT_ZOOM,
			rotation: DEFAULT_ROTATION,
		})

		const olMap = new MapOl({
			pixelRatio: PIXEL_RATIO,
			controls: [],
			target: mapRootElement.current,
			view,
		})

		setMap(olMap)
	}

	const drawTile = (isVisible: boolean) => {
		if (!map) {
			return
		}

		const tileLayer = new MapLayer()
		tileLayer.setVisible(isVisible)

		map.addLayer(tileLayer)
		layersDict.current.set('tile', tileLayer)
	}

	const drawScheme = async (imgUrl: string, rotationAngle: number, area: Area) => {
		if (!map) {
			return
		}

		let img: HTMLImageElement | null = null

		try {
			img = await loadImage(`http://localhost:8081/images/${imgUrl}`)
		} catch {
			await message.error('Не удалось загрузить схему слоя')
			return false
		}

		const rotation = degreeToRadian(rotationAngle) - Math.PI

		const { center, scale } = getImgParams(
			area.map((point) => fromLonLat(point) as any),
			rotation,
			img,
		)

		const schemeLayer = new SchemeLayer({
			url: `http://localhost:8081/images/${imgUrl}`,
			center,
			rotation,
			scale,
		})

		map.addLayer(schemeLayer as any)
		map.render()
		layersDict.current.set('scheme', schemeLayer as Layer)

		return true
	}

	const drawPolygon = (area: Area, angle: number) => {
		if (!map) {
			return
		}

		const coordinates = area.length ? getPolygonAreaByImageArea(area) : getPolygonArea(map.getView())
		const createdPolygonLayer = new PolygonLayer(coordinates)

		map.addLayer(createdPolygonLayer)
		layersDict.current.set('polygon', createdPolygonLayer)

		polygonTransform.current = new Transform({
			enableRotatedTransform: false,
			translateFeature: false,
			translate: true,
			stretch: true,
			scale: true,
			rotate: true,
			noFlip: true,
			features: [createdPolygonLayer.feature],
			keepRectangle: true,
		})

		map.addInteraction(polygonTransform.current)
		createdPolygonLayer.rotation = angle

		polygonTransform.current.on('rotating', (e: RotatingTransformEvent) => {
			createdPolygonLayer.feature.set('angle', 360 - radianToDegree(e.angle))
		})

		polygonTransform.current.on(['rotateend', 'translateend', 'scaleend'], (e: any) => {
			const angle = createdPolygonLayer.feature.get('angle') || 0

			createdPolygonLayer.rotation = (createdPolygonLayer.rotation + angle) % 360
			createdPolygonLayer.feature.set('angle', 0)

			handlePolygonChange(polygonLayer.current?.feature)
		})

		polygonLayer.current = createdPolygonLayer
		polygonTransform.current.select(createdPolygonLayer.feature, true)
		// handlePolygonChange(createdPolygonLayer.feature)
	}

	const drawDevices = (devices: Device[]) => {
		if (!devices.length) {
			return
		}

		const features = devices.map((device) => {
			const feature = new Feature({
				geometry: new Point(fromLonLat(device.coordinates)),
			})

			feature.set('rotation', device.angle * (Math.PI / 180))
			feature.set('id', device.id)
			feature.set('type', device.type)
			feature.set('active', device.isActive)

			return feature
		})

		const createdPointsLayer = new PointsLayer(features, clustering)

		createdPointsLayer.getSource()?.addFeatures(features)
		map?.addLayer(createdPointsLayer)
		layersDict.current.set('points', createdPointsLayer)
		pointsLayer.current = createdPointsLayer
	}

	const addTransformToDevices = (
		whenCameraTranslating?: (newCoords: { coords: Coordinate; deviceId: string }) => void,
		whenCameraRotating?: (newRotation: { rotation: number; deviceId: string }) => void,
	) => {
		if (
			!map ||
			!onFeatureSelect
		) {
			return
		}

		transformDevice.on(['select', 'rotatestart', 'translatestart'], (e: BasicTransformEvent) => {
			const features = e.feature?.get('features')
			if (!features || !featurePointerMove.current || !featureClick.current || !map || features.length > 1) {
				return
			}
			map.removeInteraction(featurePointerMove.current)
		})

		transformDevice.on('translating', (e: BasicTransformEvent) => {
			if (!whenCameraTranslating || !featureClick.current || !featurePointerMove.current || !map) {
				return
			}

			const coords = toLonLat(e.coordinate)
			const deviceId = e.feature.get('features')[0].get('id')

			map.removeInteraction(featurePointerMove.current)
			map.removeInteraction(featureClick.current)

			whenCameraTranslating({
				coords,
				deviceId,
			})
		})

		transformDevice.on('rotating', (e: RotatingTransformEvent) => {
			if (!whenCameraRotating || !featureClick.current || !featurePointerMove.current || !map) {
				return
			}

			map.removeInteraction(featurePointerMove.current)
			map.removeInteraction(featureClick.current)
			const deviceId = e.feature.get('features')[0].get('id')

			const normalizeAngle = 360 - (radianToDegree(e.angle) + 130) % 360
			console.log(normalizeAngle)

			whenCameraRotating({
				rotation: normalizeAngle,
				deviceId,
			})
		})

		transformDevice.on(['rotateend', 'translateend'], () => {
			if (!featurePointerMove.current || !featureClick.current || !map) {
				return
			}
			map.addInteraction(featurePointerMove.current)
			map.addInteraction(featureClick.current)
		})

		map.addInteraction(transformDevice)
	}

	const addInteractionToDevices = () => {
		if (!map || !onFeatureSelect) {
			return
		}

		featureClick.current = new Select({
			addCondition: click,
			style: (feature, resolution) => {
				const scale = getScaleByResolution(resolution)
				const style = pointStyleSelected(feature)
				const image = style?.getImage()

				image?.setScale(scale)

				return style

			},
		})

		featurePointerMove.current = new Select({
			condition: pointerMove,
			style: (feature, resolution) => {
				const scale = getScaleByResolution(resolution, 0.1)
				const style = pointStyleHovered(feature)
				const image = style?.getImage()

				const clusterSize = feature.get('features')?.length

				if (clusterSize === 1) {
					image?.setScale(scale)
				}

				return style
			},
			hitTolerance: CAMERA_HIT_ZONE_PX,
		})

		featureClick.current.on('select', onFeatureSelect)

		map.addInteraction(featureClick.current)
		map.addInteraction(featurePointerMove.current)
	}

	const removeInteractionFromDevices = () => {
		if (!map || !onFeatureSelect || !featureClick.current || !featurePointerMove.current) {
			return
		}

		featureClick.current.un('select', onFeatureSelect)

		map.removeInteraction(featureClick.current)
		map.removeInteraction(featurePointerMove.current)
	}

	const clearPoints = () => {
		const pointsLayer = layersDict.current.get('points') as PointsLayer
		if (!pointsLayer) {
			return
		}

		layersDict.current.delete('points')
		map?.removeLayer(pointsLayer)
	}

	const toggleClustering = (clusteringEnabled: boolean) => {
		if (!pointsLayer.current) {
			return
		}

		if (clusteringEnabled) {
			pointsLayer.current.disableClustering()
		} else {
			pointsLayer.current.enableClustering()
		}
	}

	const clearScheme = () => {
		const schemeLayer = layersDict.current.get('scheme')

		if (!map || !schemeLayer) {
			return
		}

		map.removeLayer(schemeLayer)
		layersDict.current.delete('scheme')
	}

	const clearPolygon = () => {
		const currentPolygonLayer = layersDict.current.get('polygon')
		if (!currentPolygonLayer || !map) {
			return
		}

		// this.addTransformToCameras()

		map.getInteractions().forEach((interaction) => {
			if (interaction instanceof Transform) {
				map?.removeInteraction(interaction)
			}
		})

		map.removeLayer(currentPolygonLayer)
		polygonLayer.current = null
		layersDict.current.delete('polygon')
	}

	const handlePolygonChange = (feature: PolygonLayer['feature']) => {
		const geometry = feature.getGeometry()
		const rectCoordinates = geometry.getCoordinates()[0]

		if (onPolygonChange && polygonLayer.current) {
			rectCoordinates.pop()
			onPolygonChange(
				rectCoordinates.map((point: [number, number]) => toLonLat(point)),
				polygonLayer.current.rotation,
			)
		}
	}

	const getPolygonArea = (view: View): Area => {
		const center = view.getCenter() || [0]
		const [centerLon, centerLat] = toLonLat(center)

		const zoom = view.getZoom() || 1

		const latRatio = LAT_RATIO / zoom
		const lonRatio = LON_RATIO / zoom

		const lonLatCoords = [
			[centerLon - lonRatio, centerLat + latRatio],
			[centerLon + lonRatio, centerLat + latRatio],
			[centerLon + lonRatio, centerLat - latRatio],
			[centerLon - lonRatio, centerLat - latRatio],
			[centerLon - lonRatio, centerLat + latRatio],
		]

		return lonLatCoords.map((coords) => fromLonLat(coords)) as Area
	}

	const getPolygonAreaByImageArea = (area: Area) => {
		return [...area, area[0]].map((coords) => transform(coords, 'EPSG:4326', 'EPSG:3857')) as Area
	}

	const toggleTileVisibility = (value: boolean) => {
		const tileLayer = layersDict.current.get('tile')
		tileLayer?.setVisible(value)
	}

	const zoomToCluster = (cluster: Feature) => {
		const features = cluster.get('features')
		if (!map || !features) {
			return
		}

		const extent = boundingExtent(features.map((feature: Feature<Point>) => feature.getGeometry()?.getCoordinates()))
		const geom = fromExtent(extent)
		geom.scale(CLUSTER_EXTENT_SCALE)

		map?.getView().fit(geom, {
			duration: 1000,
			padding: [100, 100, 100, 100],
		})
	}

	const setCenterByArea = (area: Area) => {
		if (!map) {
			return
		}

		const coordinates = area.map((point) => fromLonLat(point) as any)
		const center = getRectCenter(coordinates)

		setCenter(center)
	}

	const setCenter = (center: Coordinate) => {
		map?.getView().setCenter(center)
	}

	return {
		mapRootElement,
		map,
		initializeMap,
		drawTile,
		drawScheme,
		drawPolygon,
		drawDevices,
		addInteractionToDevices,
		addTransformToDevices,
		clearScheme,
		clearPolygon,
		clearPoints,
		removeInteractionFromDevices,
		zoomToCluster,
		setCenterByArea,
		toggleTileVisibility,
		toggleClustering,
	}
}

