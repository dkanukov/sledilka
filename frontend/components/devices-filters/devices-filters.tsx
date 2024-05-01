import { Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { useMemo } from 'react'

import styles from './devices-filters.module.css'

import { DeviceFilter, DeviceFilterKeys } from '@typos'

type Props = {
	filters: DeviceFilter
	layers: Record<string, {
		layerId: string
		layerName: string
		devicesCount: number
	}[]>
	objects: Record<string, string>
	wheFilterChange: (key: DeviceFilterKeys, value: string | undefined) => void
}

export const DevicesFilters = (props: Props) => {
	const objectOptions: DefaultOptionType[] = Object.entries(props.objects).map(([value, label]) => ({
		value,
		label,
	}))

	const layerOptions = useMemo((): DefaultOptionType[] => {
		if (props.filters.objectId) {
			return props.layers[props.filters.objectId].map((layer) => ({
				label: layer.layerName,
				value: layer.layerId,
			}))
		}

		return Object.values(props.layers).flat().map((layer) => ({
			label: layer.layerName,
			value: layer.layerId,
		}))
	}, [props.filters.objectId, props.layers])

	return (
		<div className={styles.root}>
			<Select
				allowClear
				value={props.filters?.objectId}
				className={styles.select}
				placeholder={'Объект'}
				options={objectOptions}
				onSelect={(id) => props.wheFilterChange('objectId', id)}
				onClear={() => props.wheFilterChange('objectId', undefined)}
			/>
			<Select
				allowClear
				value={props.filters?.layerId}
				className={styles.select}
				placeholder={'Слой'}
				options={layerOptions}
				onSelect={(id) => props.wheFilterChange('layerId', id)}
				onClear={() => props.wheFilterChange('layerId', undefined)}
			/>
		</div>
	)
}
