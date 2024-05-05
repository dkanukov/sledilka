'use client'

import { useEffect } from 'react'

import styles from './admin.module.css'

import { Sidebar, Map, DeviceDrawer } from '@components'
import { useObjectsStore } from '@store'
import { useCustomRouter } from '@hooks'

export default function Admin() {
	const objectsStore = useObjectsStore()
	const { customRouter, query } = useCustomRouter()

	useEffect(() => {
		const fetchObjects = async () => {
			await objectsStore.fetchObjects()
			const id = query.get('layerId')
			if (id) {
				objectsStore.handleSelectedLayerChange(id)
			}
		}

		fetchObjects()
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

	const handleFeatureSelect = (id: string) => {
		objectsStore.handleDeviceSelect(id)
	}

	const handleDeviceSave = () => {
		if (!objectsStore.selectedDevice) {
			return
		}

		objectsStore.updateDevice(objectsStore.selectedDevice)
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
					isClickOnDeviceNeeded
					image={objectsStore.selectedLayer.image}
					coordinates={objectsStore.selectedLayer.coordinates}
					angle={objectsStore.selectedLayer.angle}
					devices={objectsStore.selectedLayer.devices}
					whenLayerEditStart={handleRedirectToEditPage}
					whenFeatureSelect={handleFeatureSelect}
				/>
			)}
			{objectsStore.selectedDevice && (
				<DeviceDrawer
					device={objectsStore.selectedDevice}
					whenClose={objectsStore.flushSelectedDevice}
				/>
			)}
		</div>
	)
}
