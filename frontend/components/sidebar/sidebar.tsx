'use client'

import { Menu } from 'antd'
import { useRouter } from 'next/navigation'
import { PlusCircleFilled } from '@ant-design/icons'

import styles from './sidebar.module.css'

import { getMenuItem } from '@helpers'
import { ObjectStorage } from '@models'

interface Props {
	items: ObjectStorage[]
	selectedItem: string
	whenClick: (item: string) => void
}

export const Sidebar = (props: Props) => {
	const router = useRouter()
	const menuItems = props.items.map((item) => {
		if (item.layers.length === 0) {
			return getMenuItem({
				label: item.name,
				key: item.id,
				children: [getMenuItem({
					label: <PlusCircleFilled/>,
					key: `add-layer${item.id}`,
				})],
			})
		}
		return getMenuItem({
			label: item.name,
			key: item.id,
			children: item.layers.map((layer) => getMenuItem({
				label: layer.floorName,
				key: layer.id,
			})),
		})
	})

	const handleItemClick = (key: string) => {
		if (key.includes('add-layer')) {
			router.push(`/admin/${key.replace('add-layer', '')}`)
			return
		}

		props.whenClick(key)
	}

	return (
		<div className={styles.sidebarWrapper}>
			<Menu
				className={styles.menu}
				mode={'inline'}
				items={menuItems}
				selectedKeys={[props.selectedItem]}
				onSelect={({ key }) => handleItemClick(key)}
			/>
		</div>
	)
}
