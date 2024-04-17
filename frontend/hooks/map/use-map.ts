import { useRef, useState } from 'react'
import { Collection, Feature, Map as MapOl, View } from 'ol'
import { fromLonLat, toLonLat, transform } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { Layer } from 'ol/layer'
import { message } from 'antd'
//@ts-expect-error
import Transform from 'ol-ext/interaction/Transform'

import { MapLayer, PolygonLayer, SchemeLayer } from '.'

import { degreeToRadian, getImgParams, getRectCenter, loadImage, radianToDegree } from '@helpers'
import { Area } from '@typos'

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

type LayerKeys = 'tile' | 'points' | 'scheme' | 'polygon'

export const useMap = ({
	onPolygonChange,
}: {
	onPolygonChange?: (coordinates: Area, angle: number) => void
}) => {
	const mapRootElement = useRef<HTMLDivElement | null>(null)
	const [map, setMap] = useState<MapOl | null>(null)
	const layersDict = useRef<Map<LayerKeys, Layer>>(new Map())
	const polygonTransform = useRef<typeof Transform>()
	const polygonLayer = useRef<PolygonLayer | null>(null)

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
		clearScheme,
		clearPolygon,
		setCenterByArea,
		toggleTileVisibility,
	}
}

