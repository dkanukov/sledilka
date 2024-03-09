/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { useEffect, useRef, useState } from 'react'
import { map, Map as IMap, tileLayer, TileLayer } from 'leaflet'
import { Switch } from 'antd'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'

import { ObjectLayer } from '@models'
import { useLocalStorage, usePersistState } from '@hooks'

interface Props {
	selectedLayer: ObjectLayer
}

export const Map = (props: Props) => {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapRef, setMapRef] = useState<IMap>()
	const { state: isRenderTileLayer, updateState: setRenderTileLayer } = usePersistState('render-tile-layer', false)

	useEffect(() => {
		if (mapContainerRef.current) {
			const mapInstance = map(mapContainerRef.current).setView([props.selectedLayer.coordinateY, props.selectedLayer.coordinateX], 13)
			if (isRenderTileLayer) {
				tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3', {
				}).addTo(mapInstance)
			}

			// убираем кнопки зума
			mapInstance.removeControl(mapInstance.zoomControl)

			setMapRef(mapInstance)
		}
	}, [])

	useEffect(() => {
		if (!mapRef) {
			return
		}

		mapRef.setView([props.selectedLayer.coordinateX, props.selectedLayer.coordinateY], 13)
	}, [props.selectedLayer, mapRef])

	const toggleTileLayer = () => {
		if (!mapRef) {
			return
		}

		setRenderTileLayer(!isRenderTileLayer)

		if (!isRenderTileLayer) {
			tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3', {}).addTo(mapRef)
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
