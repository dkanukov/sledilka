/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { useCallback, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import styles from './admin.module.css'

import { Sidebar, Map } from '@components'
import { useObjectsStore } from '@store'

export default function Admin() {
	const objectsStore = useObjectsStore()
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	useEffect(() => {
		objectsStore.fetchObjects().then(() => {
			const id = searchParams.get('layerId')
			if (typeof id === 'string') {
				objectsStore.handleSelectedLayerChange(id)
			}
		})

	}, [])

	const createQueryString = useCallback((name: string, value: string) => {
		// eslint-disable-next-line compat/compat
		const params = new URLSearchParams(searchParams.toString())
		params.set(name, value)

		return params.toString()
	}, [searchParams])

	const handleSelectLayer = (key: string) => {
		objectsStore.handleSelectedLayerChange(key)
		router.push(pathname + '?' + createQueryString('layerId', key))
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
