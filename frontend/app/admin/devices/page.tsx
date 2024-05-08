'use client'
import { Typography } from 'antd'
import { useEffect, useMemo } from 'react'

import styles from './devices.module.css'

import { useDevicesList } from '@hooks'
import { DevicesFilters, DevicesTable } from '@components'

const { Title } = Typography

export default function Devices() {
	const {
		filter,
		devices,
		layerByObjectId,
		objectNameById,
		handleFilterChange,
		fetchObjects,
	} = useDevicesList()

	useEffect(() => {
		const fetchInitialData = async () => {
			await fetchObjects()
		}

		fetchInitialData().catch((e) => console.log(e))
	}, [])

	const filteredDevices = useMemo(() => {
		return devices.filter((device) => {
			const isSelectedLayer = filter.layerId ? device.layerId === filter.layerId : true
			const isSelectedObject = filter.objectId ? device.objectId === filter.objectId : true

			return isSelectedLayer && isSelectedObject
		})
	}, [filter, devices])

	return (
		<div className={styles.root}>
			<Title>Просмотр устройств</Title>
			<DevicesFilters
				filters={filter}
				layers={layerByObjectId}
				objects={objectNameById}
				wheFilterChange={handleFilterChange}
			/>
			<div className={styles.table}>
				<DevicesTable
					devices={filteredDevices}
				/>
			</div>
		</div>
	)
}
