'use client'
import { LoginOutlined } from '@ant-design/icons'
import { Button, Layout, Switch, Tabs } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import styles from './landing-header-v2.module.css'

const { Header } = Layout

type Props = {
	currentTheme: 'dark' | 'light'
	whenThemeToggle: () => void
}

export const LandingHeaderV2 = (props: Props) => {
	const path = usePathname()
	const router = useRouter()

	const [activeTabKey, setActiveTabKey] = useState(path)

	const menuItems = [
		{
			label: 'Главная',
			link: '/',
			isActive: path === '/',
		},
		{
			label: 'Контакты',
			link: '/contacts',
			isActive: path.includes('contacts'),
		},
		/*
		{
			label: 'Технологии',
			link: '/technology',
			isActive: path.includes('/how-it-works'),
		},
		{
			label: 'Обратная связь',
			link: '/feedback',
			isActive: path.includes('/feedback'),
		},
		{
			label: 'Обновления',
			link: '/changelog',
			isActive: path.includes('/changelog'),
		},
		{
			label: 'Планы',
			link: '/roadmap',
			isActive: path.includes('/roadmap'),
		}, */
	]

	const handleTabClick = (to: string) => {
		router.push(to)
		setActiveTabKey(to)
	}

	const handleNavigateToAuth = () => {
		router.push('/auth')
	}

	return (
		<Header
			className={props.currentTheme === 'light' ? styles.overrideBgc : ''}
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Tabs
				defaultActiveKey={'/'}
				activeKey={activeTabKey}
				onTabClick={handleTabClick}
				items={menuItems.map((menuItem) => ({
					label: menuItem.label,
					key: menuItem.link,
				}))}
			/>
			<div className={styles.controls}>
				<Switch
					checked={props.currentTheme === 'light'}
					onClick={props.whenThemeToggle}
				/>
				<Button
					icon={<LoginOutlined/>}
					size={'large'}
					type={'link'}
					onClick={handleNavigateToAuth}
				/>
			</div>
		</Header>
	)
}
