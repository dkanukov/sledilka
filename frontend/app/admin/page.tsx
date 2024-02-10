'use client'
import { Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { map, Map, tileLayer } from 'leaflet'

export default function Admin() {
	const mapContainerRef = useRef()
	const [mapRef, setMapRef] = useState<Map>()

	useEffect(() => {
		if (mapContainerRef.current) {
			const mapInstance = map(mapContainerRef.current).setView([55.751244, 37.618423], 13)
			tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3', {
				maxZoom: 19,
			}).addTo(mapInstance)

			setMapRef(mapInstance)
		}
	}, [])

	return (
		<div>
			<div
				ref={mapContainerRef}
				style={{
					width: '100vw',
					height: '100vh',
				}}
			/>
		</div>
	)
}