'use client'
import { useEffect, useRef } from 'react'
import { Button, Switch } from 'antd'
import { DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, SaveOutlined, VideoCameraAddOutlined } from '@ant-design/icons'
import { Coordinate } from 'ol/coordinate'
import { debounce } from 'lodash'

import styles from './map.module.css'

import { useMap, usePersistState } from '@hooks'
import { Area, Marker } from '@typos'
import { Device } from '@models'

interface Props {
	isPolygonNeed?: boolean
	image?: string
	coordinates?: Area
	markerCoordiante?: Coordinate
	devices?: Device[]
	angle?: number
	isClickOnDeviceNeeded?: boolean
	isDevicesTranslateNeeded?: boolean
	isEdit?: boolean
	hideControls?: boolean
	whenPolygonChange?: (coordinates: Area, angle: number) => void
	whenLayerEditStart?: () => void
	whenFeatureSelect?: (id: string) => void
	whenAddNewDevice?: () => void
	whenDeviceTranslating?: (newCoords: { coords: Coordinate; deviceId: string }) => void
	whenDeviceRotating?: (newRotation: { rotation: number; deviceId: string }) => void
	whenMarkerMove?: (coordinate: Coordinate) => void
}

export const Map = (props: Props) => {
	const debouncedWhenTranslater = debounce((newCoords: { coords: Coordinate; deviceId: string }) => props.whenDeviceTranslating?.(newCoords), 500)

	const handleFeatureSelect = (e: any) => {
		const [feature] = e.selected

		if (!feature) {
			return
		} else if (feature.get('features')?.length > 1) {
			zoomToCluster(feature)
			return
		}

		const deviceId = feature.get('features')?.[0]?.get('id')

		if (deviceId && props.whenFeatureSelect) {
			props.whenFeatureSelect(deviceId)
		}
	}

	const handleDeviceTranslating = (newCoords: { coords: Coordinate; deviceId: string }) => {
		if (!props.whenDeviceTranslating) {
			return
		}

		debouncedWhenTranslater(newCoords)
	}

	const handleDeviceRotating = (newRotation: { rotation: number; deviceId: string }) => {
		if (!props.whenDeviceRotating) {
			return
		}

		props.whenDeviceRotating(newRotation)
	}
	const { state: tileLayerVisible, updateState: setTileLayerVisible } = usePersistState('toggle-tile-layer', true)
	const { state: showMapControls, updateState: setShowMapControls } = usePersistState('show-map-controls', true)
	const { state: clusterDevices, updateState: setClusterDevices } = usePersistState('clustering', true)

	const marker = useRef<Marker | null>(null)

	const {
		map,
		mapRootElement,
		initializeMap,
		drawTile,
		drawScheme,
		drawMarker,
		drawPolygon,
		drawDevices,
		addInteractionToDevices,
		addTransformToDevices,
		clearScheme,
		clearPolygon,
		clearPoints,
		removeMarker,
		removeInteractionFromDevices,
		zoomToCluster,
		setCenterByArea,
		toggleClustering,
		toggleTileVisibility,
	} = useMap({
		clustering: clusterDevices,
		onPolygonChange: props.whenPolygonChange,
		onFeatureSelect: handleFeatureSelect,
	})

	const handleClusteringToggle = () => {
		setClusterDevices(!clusterDevices)
		toggleClustering(clusterDevices)
	}

	const redrawScheme = async () => {
		if (map && props.image && props.coordinates) {
			clearScheme()
			await drawScheme(
				props.image,
				props.angle || 0,
				props.coordinates,
			)
		}
	}

	const handleToggleTileLayer = () => {
		setTileLayerVisible(!tileLayerVisible)
		toggleTileVisibility(!tileLayerVisible)
	}

	useEffect(() => {
		initializeMap()
	}, [])

	useEffect(() => {
		drawTile(tileLayerVisible)

		if (props?.image) {
			drawScheme(props.image, props.angle || 0, props.coordinates || [])
				.catch(() => console.error('не загрузили картинку слоя'))
			setCenterByArea(props.coordinates || [])
		}

		if (props.isPolygonNeed) {
			drawPolygon(props.coordinates || [], props.angle || 0)
		}

		if (props.devices) {
			drawDevices(props.devices)
		}

		if (props.isClickOnDeviceNeeded) {
			addInteractionToDevices()
		}
	}, [map])

	useEffect(() => {
		if (props.isPolygonNeed) {
			drawPolygon(props.coordinates || [], props.angle || 0)
			return
		}

		clearPolygon()
	}, [props.isPolygonNeed])

	useEffect(() => {
		redrawScheme().catch(() => {})
		setCenterByArea(props.coordinates || [])

		if (props.isPolygonNeed) {
			clearPolygon()
			drawPolygon(props.coordinates || [], props.angle || 0)
		}
	}, [props.image, props.coordinates])

	useEffect(() => {
		if (props.isClickOnDeviceNeeded) {
			addInteractionToDevices()
			return
		}

		removeInteractionFromDevices()
	}, [props.isClickOnDeviceNeeded])

	useEffect(() => {
		if (props.isDevicesTranslateNeeded) {
			addTransformToDevices(handleDeviceTranslating, handleDeviceRotating)
		}
	})

	useEffect(() => {
		if (props.devices) {
			clearPoints()
			drawDevices(props.devices)
		}
	}, [props.devices])

	useEffect(() => {
		if (!map) {
			return
		}

		if (!props.markerCoordiante && marker.current) {
			removeMarker(marker.current)
			return
		}

		if (marker.current && props.markerCoordiante) {
			marker.current.feature.getGeometry()?.setCoordinates(props.markerCoordiante)
			return
		}

		if (props.markerCoordiante) {
			marker.current = drawMarker(props.markerCoordiante)
			marker.current.translate.on('translateend', () => {
				if (!props.whenMarkerMove || !marker.current) {
					return
				}

				const point = marker.current.feature.getGeometry()
				const coordinates = point?.getCoordinates()

				if (!coordinates) {
					return
				}

				props.whenMarkerMove(coordinates)
			})
		}
	})

	return (
		<>
			{!props.hideControls && (
				<div className={styles.mapControl}>
					<Button
						type={'primary'}
						icon={showMapControls ? <DoubleRightOutlined/> : <DoubleLeftOutlined/>}
						onClick={() => setShowMapControls(!showMapControls)}
					/>
					{showMapControls && (
						<>
							{props.whenAddNewDevice && (
								<Button
									ghost
									type={'primary'}
									icon={<VideoCameraAddOutlined/>}
									onClick={props.whenAddNewDevice}
								/>
							)}
							{!props.isEdit && (
								<Button
									ghost
									type={'primary'}
									icon={<EditOutlined/>}
									onClick={props.whenLayerEditStart}
								/>
							)}
							<div
								className={styles.territoryControl}
							>
								<Switch
									value={clusterDevices}
									onChange={handleClusteringToggle}
								/>
								<p>Кластеризация</p>
							</div>
							<div
								className={styles.territoryControl}
							>
								<Switch
									value={tileLayerVisible}
									onChange={handleToggleTileLayer}
								/>
								<p>Территория</p>
							</div>
						</>
					)}
				</div>
			)}
			<div
				className={styles.map}
				ref={mapRootElement}
			/>
		</>
	)
}
