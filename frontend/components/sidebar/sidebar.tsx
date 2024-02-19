'use client'

import { Menu } from 'antd'

import styles from './sidebar.module.css'

interface Props<T> {
	items: T[]
	whenClick: (item: T) => void
}

export const Sidebar = <T extends { id: string; name: string }>(props: Props<T>) => {
	console.log(props.items)
	return (
		<Menu className={styles.menu}>
			{props.items.map((item) => (
				<Menu.Item
					key={item.id}
					onClick={() => props.whenClick(item)}
					title={item.name}
				>
					<div>{item.name}</div>
				</Menu.Item>
			))}
		</Menu>
	)
}
