'use client'

import { Menu, MenuItemProps } from 'antd'

import styles from './sidebar.module.css'

interface Props<T> {
	items: T[]
	whenClick: (item: T) => void
}

const { Item } = Menu

export const Sidebar = <T extends { id: string; name: string }>(props: Props<T>) => {
	//TODO: заменить Item на items в Menu
	/* const getMenuItems = (): MenuItemProps[] => {
		return props.items.map((item) => (
			{

			}
		))
	} */
	return (
		<Menu className={styles.menu}>
			{props.items.map((item) => (
				<Item
					key={item.id}
					onClick={() => props.whenClick(item)}
					title={item.name}
				>
					<div>{item.name}</div>
				</Item>
			))}
		</Menu>
	)
}
