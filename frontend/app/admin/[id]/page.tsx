'use client'
import { message, Typography } from 'antd'
import { useEffect } from 'react'

import styles from './id.module.css'

import { Map } from '@components'
import { useLayerEditStore } from '@store'

const { Title } = Typography

export default function Id() {
	const layerStore = useLayerEditStore()

	useEffect(() => {
	})

	const handleLayerSave = async () => {
		if (!layerStore.layer) {
			return
		}

		const response = await layerStore.handleLayerUpdate(layerStore.layer)

		if (response) {
			await message.success({ content: 'Слой сохранен' })
			return
		}

		await message.error({ content: 'Слой не был сохранен' })
	}
	return (
		<div
			className={styles.root}
		>
			{layerStore.layer ? (
				<Map
					isPolygonNeed
					angle={layerStore.layer.angle}
					image={layerStore.layer.image}
					coordinates={layerStore.layer.coordinates}
					whenLayerSave={handleLayerSave}
					whenPolygonChange={layerStore.handlePolygonChange}
				/>
			) : (
				<div className={styles.emptyMessage}>
					<Title>Нет слоя с ID</Title>
				</div>
			)}
		</div>
	)
}
