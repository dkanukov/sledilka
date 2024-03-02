/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { useEffect } from 'react'

import styles from './admin.module.css'

import { ObjectStorage } from '@models'
import { Sidebar, Map } from '@components'
import { useObjectsStore } from '@store'

export default function Admin() {
	const objectsStore = useObjectsStore()

	useEffect(() => {
		objectsStore.fetchObjects()
	}, [])

	const handleSelectStorage = (objectStorage: ObjectStorage) => {
		objectsStore.handleSelectedStorageChange(objectStorage)
	}

	return (
		<div className={styles.root}>
			<Sidebar
				items={objectsStore.objects}
				whenClick={handleSelectStorage}
			/>
			{objectsStore.selectedObject && (
				<Map
					objectStorage={objectsStore.selectedObject}
				/>
			)}
		</div>
	)
}
