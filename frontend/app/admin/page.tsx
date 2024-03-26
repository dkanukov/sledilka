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

	return (
		<div className={styles.root}>
			<Sidebar
				items={objectsStore.objects}
				selectedItem={objectsStore.selectedLayer?.id ?? ''}
				whenClick={handleSelectLayer}
			/>
			{objectsStore.selectedLayer && (
				<Map
					// edit
					selectedLayer={objectsStore.selectedLayer}
				/>
			)}
		</div>
	)
}
