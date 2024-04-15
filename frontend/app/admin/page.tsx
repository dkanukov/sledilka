'use client'

import { useEffect } from 'react'

import styles from './admin.module.css'

import { Sidebar, Map } from '@components'
import { useObjectsStore } from '@store'
import { useCustomRouter } from '@hooks'

export default function Admin() {
	const objectsStore = useObjectsStore()
	const { customRouter, query } = useCustomRouter()

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

	const handleRedirectToEditPage = () => {
		if (!objectsStore.selectedLayer) {
			return
		}

		customRouter.push({
			path: `/admin/${objectsStore.selectedLayer.id}`,
		})
	}

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
					whenLayerEditStart={handleRedirectToEditPage}
				/>
			)}
		</div>
	)
}
