'use client'
import { useEffect, useRef, useState } from 'react'
import { Switch } from 'antd'
import * as L from 'leaflet'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'
import 'leaflet-path-transform'
import 'leaflet-path-drag'
import { ObjectLayer } from '@models'
import { usePersistState } from '@hooks'

const TileLayerURL = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3'

interface Props {
	selectedLayer: ObjectLayer
	handleLayerDrag?: (lan: [number, number], lot: [number, number]) => void
	edit?: boolean
}

export const Map = (props: Props) => {
	const [mapRef, setMapRef] = useState<L.Map>()
	const [groupLayerAdded, setGroupLayerAdded] = useState(false)
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const { state: isRenderTileLayer, updateState: setRenderTileLayer } = usePersistState('render-tile-layer', false)

	const handleStartEdit = () => {
		if (!mapRef) {
			return
		}

		console.log('call')
		const overlay = L.imageOverlay(
			`http://localhost:8081/images/${props.selectedLayer.image}`,
			[props.selectedLayer.lan, props.selectedLayer.lot],
		)

		const rectangle = L.rectangle([props.selectedLayer.lan, props.selectedLayer.lot], {
			color: 'red',
			interactive: true,
			//@ts-expect-error
			transform: true,
			draggable: true,
		})

		// const layersGroup = L.layerGroup([rectangle, overlay])

		mapRef.addLayer(rectangle)
		mapRef.addLayer(overlay)

		//@ts-expect-error
		rectangle.transform.enable()

		rectangle.on('transformed', () => {
			console.log(rectangle.getBounds().getNorthWest())
			const northWest = rectangle.getBounds().getNorthWest()
			const southEast = rectangle.getBounds().getSouthEast()
			const southWest = rectangle.getBounds().getSouthWest()
			const northEast = rectangle.getBounds().getNorthEast()

			const test = new L.LatLngBounds(southWest, northEast)
			props.handleLayerDrag?.([southEast.lng, southEast.lng], [northWest.lng, northWest.lat])
			overlay.setBounds(test)
		})
		mapRef.fitBounds([props.selectedLayer.lan, props.selectedLayer.lot])
		setGroupLayerAdded(true)
	}

	useEffect(() => {
		if (mapContainerRef.current && !mapRef) {
			const mapInstance = L.map(mapContainerRef.current).setView([props.selectedLayer.coordinateY, props.selectedLayer.coordinateX], 13)

			if (isRenderTileLayer) {
				L.tileLayer(TileLayerURL).addTo(mapInstance)
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

		let hasOverlay = false

		if (props.edit && !groupLayerAdded) {
			handleStartEdit()
		}

		if (!props.edit) {
			mapRef.eachLayer((layer) => {
				if (layer instanceof L.ImageOverlay) {
					hasOverlay = true
				}
			})

			const overlay = L.imageOverlay(
				`http://localhost:8081/images/${props.selectedLayer.image}`,
				[props.selectedLayer.lan, props.selectedLayer.lot],
			)

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
