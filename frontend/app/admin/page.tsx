'use client'

import { useEffect, useState } from 'react'

import styles from './admin.module.css'

import { Sidebar, Map, AddLayerSidebar } from '@components'
import { useObjectCreateStore, useObjectsStore } from '@store'
import { useCustomRouter } from '@hooks'

export default function Admin() {
	const objectsStore = useObjectsStore()
	const { customRouter, query } = useCustomRouter()
	const [action, setAction] = useState<'addLayer' | 'editLayer' | null>(null)
	const isEdit = action === 'addLayer' || action === 'editLayer'

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

	const handleAddLayer = (objectId: string) => {
		objectsStore.handleAddLayer(objectId)
		setAction('addLayer')
	}

	const handleCreateNewLayer = async () => {
		if (!objectsStore.selectedObject?.id || !objectsStore.selectedLayer) {
			return
		}
		const id = await objectsStore.createNewLayer(objectsStore.selectedObject.id, objectsStore.selectedLayer)

		await objectsStore.fetchObjects()
		objectsStore.handleSelectedLayerChange(id)

		setAction(null)
		customRouter.push({
			path: '/admin',
			query: {
				'layerId': [id],
			},
		})
	}

	const handleLayerTransform = (southWest:[number, number], northEast: [number, number]) => {
		objectsStore.handleSelectedLayerTransform(southWest, northEast)
	}

	const handleUploadImage = async (file: File) => {
		await objectsStore.handleUploadImage(file)
	}

	const renderSidebar = () => {
		switch (action) {
		case 'addLayer': return (
			<AddLayerSidebar
				selectedLayer={objectsStore.selectedLayer}
				whenUploadImage={handleUploadImage}
				whenFloorNameChange={objectsStore.handleSelectedFloorNameChange}
				whenCreateNewLayer={handleCreateNewLayer}
			/>
		)
		case null: return (
			<Sidebar
				items={objectsStore.objects}
				selectedItem={objectsStore.selectedLayer?.id ?? ''}
				whenClick={handleSelectLayer}
				whenCreateLayerClick={handleAddLayer}
			/>
		)
		}
	}

	return (
		<div className={styles.root}>
			{renderSidebar()}
			{objectsStore.selectedLayer && (
				<Map
					action={action}
					handleLayerDrag={handleLayerTransform}
					selectedLayer={objectsStore.selectedLayer}
				/>
			)}
		</div>
	)
}
