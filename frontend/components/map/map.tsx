'use client'
import { useEffect, useRef, useState } from 'react'
import { Button, Switch } from 'antd'
import * as L from 'leaflet'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'
import 'leaflet-path-transform'
import { ObjectLayer } from '@models'
import { usePersistState } from '@hooks'

const TileLayerURL = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3'

interface Props {
	selectedLayer: ObjectLayer
	handleLayerDrag?: (southWest: [number, number], northEast: [number, number]) => void
	handleDeviceDrag?: (deviceId: string, coords: [number, number]) => void
	handleSaveDices?: () => void
	edit?: boolean
	action?: 'addLayer' | 'editLayer' | null
	moveObject?: boolean
}

export const Map = (props: Props) => {
	const [mapRef, setMapRef] = useState<L.Map>()
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapLayers, setMapLayers] = useState<{
		imageOverlay?: null | L.ImageOverlay
		editRectangle?: null | L.Rectangle
		editImageOverlay?: null | L.ImageOverlay
		tile?: null | L.TileLayer
	}>({
		imageOverlay: null,
		editRectangle: null,
		tile: null,
		editImageOverlay: null,
	})
	const { state: isRenderTileLayer, updateState: setRenderTileLayer } = usePersistState('render-tile-layer', false)

	const handleStartEdit = () => {
		if (!mapRef) {
			return
		}

		const overlay = L.imageOverlay(
			`http://backend:8081/images/${props.selectedLayer.image}`,
			[props.selectedLayer.southWest, props.selectedLayer.northEast],
		).addTo(mapRef)

		const rectangle = L.rectangle([props.selectedLayer.southWest, props.selectedLayer.northEast], {
			color: 'red',
			interactive: true,
			//@ts-expect-error
			transform: true,
			draggable: true,
		}).addTo(mapRef)

		setMapLayers({
			...mapLayers,
			imageOverlay: overlay,
		})

		//@ts-expect-error
		rectangle.transform.enable()
		mapRef.fitBounds([props.selectedLayer.southWest, props.selectedLayer.northEast])

		rectangle.on('transformed', (e) => {
			if (e.type === 'scalestart' || e.type === 'scale' || e.type === 'scaleend') {
				return
			}

			//@ts-expect-error
			const rotation = e.rotation as number
			const southWest = rectangle.getBounds().getSouthWest()
			const northEast = rectangle.getBounds().getNorthEast()

			props.handleLayerDrag?.([southWest.lat, southWest.lng], [northEast.lat, northEast.lng])
			overlay.setBounds(new L.LatLngBounds(southWest, northEast))
		})

	}

	const handleStartAddingLayer = () => {
		if (!mapRef || mapLayers.editRectangle) {
			console.log('end')
			return
		}

		console.log('start')

		const rectangle = L.rectangle([props.selectedLayer.southWest, props.selectedLayer.northEast], {
			color: 'red',
			interactive: true,
			//@ts-expect-error
			transform: true,
			draggable: true,
		}).addTo(mapRef)
		setMapLayers({
			...mapLayers,
			editRectangle: rectangle,
		})

		//@ts-expect-error
		rectangle.transform.enable()

		rectangle.on('transformed', (e) => {
			if (e.type === 'scalestart' || e.type === 'scale' || e.type === 'scaleend') {
				return
			}

			const southWest = rectangle.getBounds().getSouthWest()
			const northEast = rectangle.getBounds().getNorthEast()

			props.handleLayerDrag?.([southWest.lat, southWest.lng], [northEast.lat, northEast.lng])
		})
	}

	useEffect(() => {
		if (mapContainerRef.current && !mapRef) {
			const mapInstance = L.map(mapContainerRef.current).setView([props.selectedLayer.coordinateY, props.selectedLayer.coordinateX], 13)

			if (isRenderTileLayer) {
				const tileLayer = L.tileLayer(TileLayerURL).addTo(mapInstance)
				setMapLayers({
					...mapLayers,
					tile: tileLayer,
				})
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

		if (props.edit && !mapLayers.imageOverlay) {
			handleStartEdit()
		}

		if (!props.edit && !props.action) {
			mapLayers.imageOverlay?.remove()
			mapLayers.editRectangle?.remove()
			mapLayers.editImageOverlay?.remove()
			// @ts-expect-error
			mapLayers.editRectangle?.transform?.disable?.()
			setMapLayers({
				imageOverlay: null,
				editImageOverlay: null,
				editRectangle: null,
			})

			const overlay = L.imageOverlay(
				`http://backend:8081/images/${props.selectedLayer.image}`,
				[props.selectedLayer.southWest, props.selectedLayer.northEast],
			).addTo(mapRef)
			setMapLayers({
				...mapLayers,
				imageOverlay: overlay,
			})
			mapRef.fitBounds([props.selectedLayer.southWest, props.selectedLayer.northEast])

			const CustomMarker = L.Marker.extend({
				id: '',
			})

			if (props.moveObject) {
				const features = props.selectedLayer.devices.map((device) => {
					console.log(device)
					const icon = L.icon({
						iconUrl: '/camera.png',
						iconSize: [20, 20],
					})

					const marker = new CustomMarker([device.locationX, device.locationY], {
						icon: icon,
						interactive: true,
						draggable: true,
						id: device.id,
					}).addTo(mapRef)

					marker.on('dragend', (e) => {
						const coords = [e.target.getLatLng().lat, e.target.getLatLng().lng] as [number, number]
						const deviceId = e.target.options.id as string
						props.handleDeviceDrag?.(deviceId, coords)
					})
				})
			}
		}

		if (props.action === 'addLayer') {
			mapLayers.imageOverlay?.remove()
			handleStartAddingLayer()
		}

	}, [props.selectedLayer, props.action, mapRef])

	useEffect(() => {
		if (props.action !== 'addLayer' || !mapRef) {
			return
		}

		if (props.selectedLayer.image) {
			const overlay = L.imageOverlay(
				`http://backend:8081/images/${props.selectedLayer.image}`,
				[props.selectedLayer.southWest, props.selectedLayer.northEast],
			).addTo(mapRef)

			setMapLayers({
				...mapLayers,
				editImageOverlay: overlay,
			})

			mapLayers.editRectangle?.on('transformed', (e) => {
				if (e.type === 'scalestart' || e.type === 'scale' || e.type === 'scaleend') {
					return
				}

				const southWest = mapLayers.editRectangle?.getBounds().getSouthWest()
				const northEast = mapLayers.editRectangle?.getBounds().getNorthEast()
				if (southWest && northEast) {
					overlay.setBounds(new L.LatLngBounds(southWest, northEast))
				}
			})
		}
	}, [props.selectedLayer.image])

	const toggleTileLayer = () => {
		if (!mapRef) {
			return
		}

		setRenderTileLayer(!isRenderTileLayer)

		if (!isRenderTileLayer) {
			const tileLayer = L.tileLayer(TileLayerURL).addTo(mapRef)
			setMapLayers({
				...mapLayers,
				tile: tileLayer,
			})
			return
		}
		mapLayers.tile?.remove()
	}

	return (
		<div
			ref={mapContainerRef}
			className={styles.map}
		>
			<div
				className={styles.mapControl}
			>
				{props.moveObject && (
					<Button
						ghost
						type={'primary'}
						onClick={props.handleSaveDices}
					>
					Сохранить изменения
					</Button>
				)}
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
