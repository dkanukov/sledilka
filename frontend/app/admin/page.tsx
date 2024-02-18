'use client'
import styles from './admin.module.css'

import { Sidebar, Map } from '@components'
import { useObjectsStore } from '@store'

export default function Admin() {
	const objectsStore = useObjectsStore()

	return (
		<div className={styles.root}>
			<Sidebar
				items={objectsStore.objects}
				whenClick={() => {}}
			/>
			<Map/>
		</div>
	)
}