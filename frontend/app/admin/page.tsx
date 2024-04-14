'use client'

import { useEffect, useState } from 'react'

import styles from './admin.module.css'

import { Sidebar, Map, AddLayerSidebar } from '@components'
import { useObjectsStore } from '@store'
import { useCustomRouter } from '@hooks'

export default function Admin() {
	const objectsStore = useObjectsStore()
	const { customRouter, query } = useCustomRouter()
	const [action, setAction] = useState<'addLayer' | 'editLayer' | null>(null)

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

	const handleEditToggle = () => {
		if (action === 'editLayer') {
			setAction(null)
			return
		}

		setAction('editLayer')
	}

	/* const handleLayerTransform = (southWest:[number, number], northEast: [number, number]) => {
		objectsStore.handleSelectedLayerTransform(southWest, northEast)
	} */

	const renderSidebar = () => {
		switch (action) {
		/* case 'addLayer': return (
			<AddLayerSidebar
				selectedLayer={objectsStore.selectedLayer}
				whenCancel={handleCancel}
				whenUploadImage={handleUploadImage}
				whenFloorNameChange={objectsStore.handleSelectedFloorNameChange}
				whenCreateNewLayer={handleCreateNewLayer}
			/>
		) */
		case 'editLayer': return (
			<>edit sidebar</>
		)
		case null: return (
			<Sidebar
				items={objectsStore.objects}
				selectedItem={objectsStore.selectedLayer?.id ?? ''}
				whenClick={handleSelectLayer}
			/>
		)
		}
	}

	return (
		<div className={styles.root}>
			{renderSidebar()}
			{objectsStore.selectedLayer && (
				<Map
					selectedLayer={objectsStore.selectedLayer}
					whenPolygonChange={objectsStore.handlePolygonChange}
				/>
			)}
		</div>
	)
}
