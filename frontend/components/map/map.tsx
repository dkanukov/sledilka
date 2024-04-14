'use client'
import { useEffect } from 'react'
import { Switch } from 'antd'

import styles from './map.module.css'

import { useMap, usePersistState } from '@hooks'
import { ObjectLayer } from '@models'
import { Area } from '@typos'

interface Props {
	selectedLayer: ObjectLayer
	whenPolygonChange?: (coordinates: Area, angle: number) => void
}

export const Map = (props: Props) => {
	const {
		map,
		mapRootElement,
		initializeMap,
		drawTile,
		drawScheme,
		drawPolygon,
		clearScheme,
		setCenterByArea,
		toggleTileVisibility,
	} = useMap({
		onPolygonChange: props.whenPolygonChange,
	})
	const { state: isTileVisible, updateState: setIsTileVisible } = usePersistState('toggle-tile-layer', true)

	const redrawScheme = async () => {
		if (map && props.selectedLayer.image && props.selectedLayer.coordinates) {
			clearScheme()
			await drawScheme(
				props.selectedLayer.image,
				props.selectedLayer.angle,
				props.selectedLayer.coordinates,
			)
		}
	}

	const handleToggleTileLayer = () => {
		setIsTileVisible(!isTileVisible)
		toggleTileVisibility(!isTileVisible)
	}

	useEffect(() => {
		initializeMap()
	}, [])

	useEffect(() => {
		drawTile(isTileVisible)

		if (props.selectedLayer?.image) {
			drawScheme(props.selectedLayer.image, props.selectedLayer.angle, props.selectedLayer.coordinates)
				.catch(() => console.error('не загрузили картинку слоя'))
			setCenterByArea(props.selectedLayer.coordinates)
		}

		drawPolygon(props.selectedLayer.coordinates, props.selectedLayer.angle)
	}, [map])

	useEffect(() => {
		console.log('change')
		console.log(props.selectedLayer)
		redrawScheme().catch(() => {})
		setCenterByArea(props.selectedLayer.coordinates)
	}, [props.selectedLayer.image, props.selectedLayer.coordinates])

	return (
		<>
			<div className={styles.mapControl}>
				<div
					className={styles.territoryControl}
				>
					<Switch
						value={isTileVisible}
						onChange={handleToggleTileLayer}
					/>
					<p>Территория</p>
				</div>
			</div>
			<div
				className={styles.map}
				ref={mapRootElement}
			/>
		</>
	)
}
