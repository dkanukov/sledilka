'use client'

import { Layout, Menu } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

import styles from './admin-header.module.css'

import { MenuItem } from '@typos'

const { Header } = Layout
export const AdminHeader = () => {
	const path = usePathname()

	const menuItems: MenuItem[] = [
		{
			label: <Link href={'/admin'}>Объекты</Link>,
			key: '/admin',
		},
		{
			label: <Link href={'/admin/devices'}>Устройства</Link>,
			key: '/admin/devices',
		},
		{
			label: <Link href={'/admin/object-create'}>Добавить объект</Link>,
			key: '/admin/object-create',
		},
	]

	return (
		<Header
			className={styles.header}
		>
			<Menu
				mode={'horizontal'}
				items={menuItems}
				activeKey={path}
			/>
		</Header>
	)
}
