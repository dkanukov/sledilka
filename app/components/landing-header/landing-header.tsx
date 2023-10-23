"use client"
import { MenuItem } from "@/types/menu-items"
import { Link } from "@mui/joy"
import { usePathname } from "next/navigation"
import styles from './landing-header.module.css'

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
			isActive: path.includes('/contacts')
		}
	]
	return (
		<div className={styles.header}>
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
		</div>
	)
}
