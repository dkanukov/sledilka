'use client'
import { useEffect } from 'react'
import { Switch, Typography } from 'antd'

import styles from './map.module.css'

import { useMap, usePersistState } from '@hooks'
import { ObjectLayer } from '@models'

interface Props {
	selectedLayer: ObjectLayer
}

const { Text } = Typography

export const Map = (props: Props) => {
	const {
		map,
		mapRootElement,
		initializeMap,
		drawTile,
		drawScheme,
	} = useMap()
	const { state: isTileVisible, updateState: setIsTileVisible } = usePersistState('toggle-tile-layer', true)

	useEffect(() => {
		initializeMap()
	}, [])

	useEffect(() => {
		console.log(isTileVisible)
		drawTile(isTileVisible)

		/* if (props.selectedLayer?.image) {
			drawScheme(props.selectedLayer.image, props.selectedLayer.angle || 0, [props.selectedLayer.southWest, props.selectedLayer.northEast])
				.catch(() => console.error('не загрузили картинку слоя'))
		} */
	}, [map, isTileVisible, props.selectedLayer])

	return (
		<>
			<div className={styles.mapControl}>
				<div
					className={styles.territoryControl}
				>
					<Switch
						defaultChecked={isTileVisible}
						onChange={() => setIsTileVisible(!isTileVisible)}
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
