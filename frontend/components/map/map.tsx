'use client'
import { useEffect, useRef, useState } from 'react'
import { map, Map as IMap, tileLayer } from 'leaflet'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'

export const Map = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapRef, setMapRef] = useState<IMap>()

	useEffect(() => {
		if (mapContainerRef.current) {
			const mapInstance = map(mapContainerRef.current).setView([55.751244, 37.618423], 13)
			tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3', {
			}).addTo(mapInstance)

			// убираем кнопки зума
			mapInstance.removeControl(mapInstance.zoomControl)

			setMapRef(mapInstance)
		}
	}, [])

	return (
		<div
			ref={mapContainerRef}
			className={styles.map}
		/>
	)
}