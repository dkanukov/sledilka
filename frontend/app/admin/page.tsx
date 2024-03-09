/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { useEffect } from 'react'

import styles from './admin.module.css'

import { Sidebar, Map } from '@components'
import { useObjectsStore } from '@store'

export default function Admin() {
	const objectsStore = useObjectsStore()

	useEffect(() => {
		objectsStore.fetchObjects()
	}, [])

	const handleSelectLayer = (key: string) => {
		objectsStore.handleSelectedLayerChange(key)
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
					selectedLayer={objectsStore.selectedLayer}
				/>
			)}
		</div>
	)
}
