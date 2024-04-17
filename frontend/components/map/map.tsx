'use client'
import { useEffect } from 'react'
import { Button, Switch } from 'antd'
import { DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'

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
	whenPolygonChange?: (coordinates: Area, angle: number) => void
	whenLayerEditStart?: () => void
	whenLayerSave?: () => void
}

export const Map = (props: Props) => {
	const {
		map,
		mapRootElement,
		initializeMap,
		drawTile,
		drawScheme,
		drawPolygon,
		drawDevices,
		clearScheme,
		clearPolygon,
		setCenterByArea,
		toggleTileVisibility,
	} = useMap({
		onPolygonChange: props.whenPolygonChange,
	})
	const { state: tileLayerVisible, updateState: setTileLayerVisible } = usePersistState('toggle-tile-layer', true)
	const { state: showMapControls, updateState: setShowMapControls } = usePersistState('show-map-controls', true)

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
						{!props.isPolygonNeed && (
							<Button
								ghost
								type={'primary'}
								icon={<EditOutlined/>}
								onClick={props.whenLayerEditStart}
							/>
						)}
						{props.whenLayerSave && (
							<Button
								ghost
								type={'primary'}
								icon={<SaveOutlined/>}
								onClick={props.whenLayerSave}
							/>
						)}
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
