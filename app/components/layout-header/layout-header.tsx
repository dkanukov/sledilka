'use client'
import { Button } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'

import styles from './layout-header.module.css'

import { MenuItem } from '@/types/menu-items'

export default function LayoutHeader() {
	const path = usePathname()
	const router = useRouter()
	const menuItems: MenuItem[] = [
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

	const handleNavButtonClick = (menuItem: MenuItem) => {
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
