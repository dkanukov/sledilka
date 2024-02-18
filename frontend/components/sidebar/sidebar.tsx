'use client'

import { Menu } from 'antd'

import styles from './sidebar.module.css'

interface Props<T> {
	items: T[]
	whenClick: (item: T) => void
}

export const Sidebar = <T extends { id: string; name: string }>(props: Props<T>) => {
	return (
		<div className={styles.sidebar}>
			{props.items.map((item) => (
				<Menu/>
			))}
		</div>
	)
}