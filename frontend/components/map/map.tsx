/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { useEffect, useRef, useState } from 'react'
import { map, Map as IMap, tileLayer, TileLayer, imageOverlay } from 'leaflet'
import { Switch } from 'antd'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'

import { ObjectLayer } from '@models'
import { usePersistState } from '@hooks'

const TileLayerURL = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3'

interface Props {
	selectedLayer: ObjectLayer
}

export const Map = (props: Props) => {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapRef, setMapRef] = useState<IMap>()
	const { state: isRenderTileLayer, updateState: setRenderTileLayer } = usePersistState('render-tile-layer', false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (mapContainerRef.current && !mapRef) {
			const mapInstance = map(mapContainerRef.current).setView([props.selectedLayer.coordinateY, props.selectedLayer.coordinateX], 13)

			if (isRenderTileLayer) {
				tileLayer(TileLayerURL, {
				}).addTo(mapInstance)
			}

			// убираем кнопки зума
			mapInstance.removeControl(mapInstance.zoomControl)

			setMapRef(mapInstance)
		}
	})

	useEffect(() => {
		if (!mapRef) {
			return
		}

		mapRef.setView([/* props.selectedLayer.coordinateX, props.selectedLayer.coordinateY */40.799311, -74.118464], 13)
		imageOverlay('https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg', [[40.799311, -74.118464], [40.68202047785919, -74.33]]).addTo(mapRef)
	}, [props.selectedLayer, mapRef])

	const toggleTileLayer = () => {
		if (!mapRef) {
			return
		}

		setRenderTileLayer(!isRenderTileLayer)

		if (!isRenderTileLayer) {
			tileLayer(TileLayerURL, {}).addTo(mapRef)
			return
		}

		mapRef.eachLayer((layer) => {
			if (layer instanceof TileLayer) {
				layer.remove()
			}
		})
	}

	return (
		<div
			ref={mapContainerRef}
			className={styles.map}
		>
			<div
				className={styles.mapControl}
			>
				<Switch
					checked={isRenderTileLayer}
					onClick={toggleTileLayer}
				/>
				<p>
					Отображать подкладку
				</p>
			</div>
		</div>
	)
}
