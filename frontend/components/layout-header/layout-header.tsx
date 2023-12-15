'use client'
import { Button } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'

import styles from './layout-header.module.css'

import { MenuItemHeader } from '@/types/menu-items'

export const LayoutHeader = () => {
	const path = usePathname()
	const router = useRouter()
	const menuItems: MenuItemHeader[] = [
		{
			label: 'Просмотр устройств',
			link: '/devices-overview',
			isActive: path.includes('/devices-overview'),
		},
		{
			label: 'Test',
			link: '/create-device',
			isActive: path.includes('/create-device'),
		},
	]

	const handleNavButtonClick = (menuItem: MenuItemHeader) => {
		router.push(menuItem.link)
	}

	return (
		<div className={styles.container}>
			<div className={styles.buttonGroup}>
				{menuItems.map((menuItem) => (
					<Button
						sx={{

						}}
						variant={menuItem.isActive ? 'contained' : 'outlined'}
						key={menuItem.link}
						onClick={() => handleNavButtonClick(menuItem)}
					>
						{menuItem.label}
					</Button>
				))}
			</div>
		</div>
	)
}
