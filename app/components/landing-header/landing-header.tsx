'use client'
import { Link } from '@mui/joy'
import { usePathname } from 'next/navigation'
import { Paper } from '@mui/material'

import styles from './landing-header.module.css'

import { MenuItem } from '@/types/menu-items'

export default function LandingHeader() {
	const path = usePathname()

	const menuItems: MenuItem[] = [
		{
			label: 'Главная',
			link: '/',
			isActive: path === '/',
		},
		{
			label: 'Контакты',
			link: '/contacts',
			isActive: path.includes('/contacts'),
		},
		{
			label: 'Backend',
			link: '/how-it-works/backend',
			isActive: path.includes('/how-it-works/backend'),
		},
		{
			label: 'Frontend',
			link: '/how-it-works/frontend',
			isActive: path.includes('/how-it-works/frontend'),
		},
    {
   			label: 'Обратная связь',
	  		link: '/feedback',
  			isActive: path.includes('/feedback'),
    }
	]

	return (
		<Paper
			className={styles.header}
			elevation={3}
		>
			<img
				width={'80px'}
				height={'80px'}
				src="/logo.png"
			/>
			{
				menuItems.map((item) => (
					<Link
						level="title-lg"
						href={item.link}
						key={item.link}
						underline={item.isActive ? 'always' : 'hover'}
					>
						{item.label}
					</Link>
				))
			}
		</Paper>
	)
}
