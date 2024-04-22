'use client'
import { use, useEffect } from 'react'
import { Button, Switch } from 'antd'
import { DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, SaveOutlined, VideoCameraAddOutlined } from '@ant-design/icons'

import styles from './map.module.css'

import { useMap, usePersistState } from '@hooks'
import { Area } from '@typos'
import { Device } from '@models'

interface Props {
	isPolygonNeed?: boolean
	image?: string
	coordinates?: Area
	devices?: Device[]
	angle?: number
	isClickOnDeviceNeeded?: boolean
	isDevicesTranslateNeeded?: boolean
	isEdit?: boolean
	whenPolygonChange?: (coordinates: Area, angle: number) => void
	whenLayerEditStart?: () => void
	whenFeatureSelect?: (id: string) => void
	whenAddNewDevice?: () => void
}

export const Map = (props: Props) => {
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
	const { state: tileLayerVisible, updateState: setTileLayerVisible } = usePersistState('toggle-tile-layer', true)
	const { state: showMapControls, updateState: setShowMapControls } = usePersistState('show-map-controls', true)
	const { state: clusterDevices, updateState: setClusterDevices } = usePersistState('clustering', true)

	const {
		map,
		mapRootElement,
		initializeMap,
		drawTile,
		drawScheme,
		drawPolygon,
		drawDevices,
		addInteractionToDevices,
		clearScheme,
		clearPolygon,
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
		if (map && props.image && props.coordinates && props.angle !== undefined) {
			clearScheme()
			await drawScheme(
				props.image,
				props.angle,
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
		if (props.devices) {
			drawDevices(props.devices)
		}
	}, [props.devices])

	return (
		<>
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
			<div
				className={styles.map}
				ref={mapRootElement}
			/>
		</>
	)
}
