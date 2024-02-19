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

	return (
		<div className={styles.root}>
			<Sidebar
				items={objectsStore.objects}
				whenClick={objectsStore.handleSelectedStorageChange}
			/>
			<Map/>
		</div>
	)
}
