'use client'
import styles from './object-create.module.css'

import { CreateObjectForms } from '@components'
import { useCreateObject } from '@hooks'

export default function ObjectCreate() {
	const {
		handleCreateObject,
	} = useCreateObject()

	return (
		<div className={styles.root}>
			<CreateObjectForms.FirstStep
				whenCreateObject={handleCreateObject}
			/>
		</div>
	)
}
