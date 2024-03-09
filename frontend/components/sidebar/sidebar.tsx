'use client'

import { Menu } from 'antd'

import styles from './sidebar.module.css'

import { getMenuItem } from '@helpers'
import { ObjectStorage } from '@models'

interface Props {
	items: ObjectStorage[]
	selectedItem: string
	whenClick: (item: string) => void
}

export const Sidebar = (props: Props) => {
	const menuItems = props.items.map((item) => (
		getMenuItem({
			label: item.name,
			key: item.id,
			type: 'group',
			children: item.layers.map((layer) => getMenuItem({
				label: layer.floorName,
				key: layer.id,
			})),
		})
	))

	return (
		<Menu
			className={styles.menu}
			selectedKeys={[props.selectedItem]}
			items={menuItems}
			onSelect={(item) => props.whenClick(item.key)}
		/>
	)
}
