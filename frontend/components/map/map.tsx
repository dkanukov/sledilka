'use client'
import { useEffect, useRef, useState } from 'react'
import { Switch } from 'antd'
import * as L from 'leaflet'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

import { ObjectLayer } from '@models'
import { usePersistState } from '@hooks'

const TileLayerURL = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3'

interface Props {
	selectedLayer: ObjectLayer
	handleLayerDrag?: (e: L.LatLng | L.LatLng[]) => void
	edit?: boolean
}

export const Map = (props: Props) => {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapRef, setMapRef] = useState<L.Map>()
	const { state: isRenderTileLayer, updateState: setRenderTileLayer } = usePersistState('render-tile-layer', false)

	const handleStartEdit = (overlay: L.ImageOverlay) => {
		if (!mapRef || !props.handleLayerDrag) {
			return
		}
		overlay.pm.enableLayerDrag()

		overlay.on('pm:change', (e) => props.handleLayerDrag?.(e.latlngs))

	}

	useEffect(() => {
		if (mapContainerRef.current && !mapRef) {
			const mapInstance = L.map(mapContainerRef.current).setView([props.selectedLayer.coordinateY, props.selectedLayer.coordinateX], 13)

			if (isRenderTileLayer) {
				L.tileLayer(TileLayerURL, {
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

		mapRef.pm.addControls({
			position: 'topleft',
		})

		const overlay = L.imageOverlay(
			`http://localhost:8081/images/${props.selectedLayer.image}`,
			[props.selectedLayer.lan, props.selectedLayer.lot],
			{ interactive: true },
		)

		let hasOverlay = false
		mapRef.eachLayer((layer) => {
			if (layer instanceof L.ImageOverlay) {
				hasOverlay = true
			}
		})

		if (props.edit) {
			overlay.on('click', () => handleStartEdit(overlay))

			if (!hasOverlay) {
				mapRef.addLayer(overlay)
				mapRef.fitBounds([props.selectedLayer.lan, props.selectedLayer.lot])
			}
		}

		if (!props.edit) {
			if (hasOverlay) {
				mapRef.eachLayer((layer) => {
					if (layer instanceof L.ImageOverlay) {
						layer.remove()
					}
				})
			}
			mapRef.addLayer(overlay)
			mapRef.fitBounds([props.selectedLayer.lan, props.selectedLayer.lot])
		}

	}, [props.selectedLayer, mapRef])

	const toggleTileLayer = () => {
		if (!mapRef) {
			return
		}

		setRenderTileLayer(!isRenderTileLayer)

		if (!isRenderTileLayer) {
			L.tileLayer(TileLayerURL).addTo(mapRef)
			return
		}

		mapRef.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
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
