import { useRef, useState } from 'react'
import { Map as MapOl, View } from 'ol'
import { fromLonLat } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { Layer } from 'ol/layer'
import { message } from 'antd'

import { MapLayer, SchemeLayer } from '.'

import { degreeToRadian, getImgParams, loadImage } from '@helpers'
import { Area } from '@typos'

const PIXEL_RATIO = 2
const DEFAULT_CENTER = fromLonLat([37.619965, 55.754585])
const DEFAULT_ZOOM = 17.4
const DEFAULT_ROTATION = 0

type LayerKeys = 'tile' | 'points' | 'scheme' | 'polygon'

export const useMap = () => {
	const mapRootElement = useRef<HTMLDivElement | null>(null)
	const [map, setMap] = useState<MapOl | null>(null)
	const [layersDict, setLayersDict] = useState<Record<LayerKeys, Layer | null>>({
		tile: null,
		points: null,
		scheme: null,
		polygon: null,
	})

	const initializeMap = (center?: Coordinate) => {
		if (!mapRootElement.current) {
			console.log('return')
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

		if (!isVisible) {
			const tileLayer = layersDict.tile as MapLayer
			setLayersDict({
				...layersDict,
				tile: null,
			})
			map.removeLayer(tileLayer)
			console.log('remove')
			return
		}

		const tileLayer = new MapLayer()
		tileLayer.setVisible(isVisible)

		map.addLayer(tileLayer)
		setLayersDict({
			...layersDict,
			tile: tileLayer,
		})
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
			url: imgUrl,
			center,
			rotation,
			scale,
		})

		map.addLayer(schemeLayer as any)
		setLayersDict({
			...layersDict,
			scheme: schemeLayer as Layer,
		})

		return true
	}

	return {
		mapRootElement,
		map,
		initializeMap,
		drawTile,
		drawScheme,
	}
}
