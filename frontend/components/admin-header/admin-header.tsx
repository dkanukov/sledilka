'use client'

import { Layout, Menu, Typography } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import styles from './admin-header.module.css'

import { MenuItem } from '@typos'

const { Header } = Layout
const { Title } = Typography

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
			<div className={styles.logo}>
				<Image
					src={'/logo.png'}
					alt={'logo'}
					width={50}
					height={50}
				/>
				<Title
					className={styles.headerText}
					level={3}
				>
					Sledilka
				</Title>
			</div>
			<Menu
				className={styles.tabs}
				mode={'horizontal'}
				items={menuItems}
				activeKey={path}
			/>
		</Header>
	)
}
