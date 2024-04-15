'use client'

import { useEffect, useState } from 'react'

import styles from './admin.module.css'

import { Sidebar, Map, AddLayerSidebar } from '@components'
import { useObjectsStore } from '@store'
import { useCustomRouter } from '@hooks'
import { message } from 'antd'

const enum Mode {
	ADD_LAYER = 'ADD_LAYER',
	ADD_CAMERA = 'ADD_CAMERA',
	CAMERA_INFO = 'CAMERA_INFO',
	EDIT_LAYER = 'EDIT_LAYER',
}

export default function Admin() {
	const objectsStore = useObjectsStore()
	const { customRouter, query } = useCustomRouter()
	const [mode, setMode] = useState<Mode | null>(null)

	useEffect(() => {
		objectsStore.fetchObjects()
			.then(() => {
				const id = query.get('layerId')
				if (id) {
					objectsStore.handleSelectedLayerChange(id)
				}
			})
			.catch(() => console.error('cant get objects'))
	}, [])

	const handleSelectLayer = (key: string) => {
		objectsStore.handleSelectedLayerChange(key)
		customRouter.push({
			path: '/admin',
			query: {
				layerId: [key],
			},
		})
	}

	const handleSelectedLayerEditStart = () => {
		setMode(Mode.EDIT_LAYER)
	}

	const handleLayerSave = async () => {
		if (!objectsStore.selectedLayer) {
			return
		}

		const response = await objectsStore.handleSelectedLayerUpdate(objectsStore.selectedLayer)

		if (response) {
			await message.success({ content: 'Слой сохранен' })
			setMode(null)
			return
		}

		await message.error({ content: 'Слой не был сохранен' })
	}

	/* const handleLayerTransform = (southWest:[number, number], northEast: [number, number]) => {
		objectsStore.handleSelectedLayerTransform(southWest, northEast)
	} */

	return (
		<div className={styles.root}>
			<Sidebar
				items={objectsStore.objects}
				selectedItem={objectsStore.selectedLayer?.id ?? ''}
				whenClick={handleSelectLayer}
			/>
			{objectsStore.selectedLayer && (
				<Map
					isPolygonNeed={false}
					image={objectsStore.selectedLayer.image}
					coordinates={objectsStore.selectedLayer.coordinates}
					angle={objectsStore.selectedLayer.angle}
					whenPolygonChange={objectsStore.handlePolygonChange}
					whenLayerEditStart={handleSelectedLayerEditStart}
					whenLayerSave={handleLayerSave}
				/>
			)}
		</div>
	)
}
