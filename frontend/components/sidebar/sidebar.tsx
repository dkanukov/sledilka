'use client'

import { Menu } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import styles from './sidebar.module.css'

import { getMenuItem } from '@helpers'
import { ObjectStorage } from '@models'

interface Props {
	items: ObjectStorage[]
	selectedItem: string
	whenClick: (item: string) => void
	whenCreateLayerClick: () => void
}

export const Sidebar = (props: Props) => {
	const menuItems = props.items.map((item) => (
		getMenuItem({
			label: item.name,
			key: item.id,
			type: 'group',
			children: [...item.layers.map((layer) => getMenuItem({
				label: layer.floorName,
				key: layer.id,
			})), {
				label: '+',
				key: `create-layer-${uuidv4()}`,
			}],
		})
	))

	const handleItemClick = (key: string) => {
		if (key.includes('create-layer')) {
			props.whenCreateLayerClick()
			return
		}
		props.whenClick(key)
	}

	return (
		<div className={styles.sidebarWrapper}>
			<Menu
				className={styles.menu}
				selectedKeys={[props.selectedItem]}
				items={menuItems}
				onSelect={({ key }) => handleItemClick(key)}
			/>
		</div>
	)
}
