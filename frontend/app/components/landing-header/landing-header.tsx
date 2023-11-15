'use client'
import { Link, Tooltip, Typography } from '@mui/joy'
import { usePathname } from 'next/navigation'
import { AppBar, Badge, Box, IconButton, Menu, MenuItem, Paper, Toolbar } from '@mui/material'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'

import styles from './landing-header.module.css'

import { MenuItemHeader } from '@/types/menu-items'

export default function LandingHeader() {
	const path = usePathname()
	const menuItems: MenuItemHeader[] = [
		{
			label: 'Главная',
			link: '/',
			isActive: path === '/',
		},
		{
			label: 'Технологии',
			link: '/technology',
			isActive: path.includes('/how-it-works'),
		},
		{
			label: 'Контакты',
			link: '/contacts',
			isActive: path.includes('/contacts'),
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
		},
	]
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null)
	const mobileMenuId = 'primary-search-account-menu-mobile'
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget)
	}
	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null)
	}

	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			id={mobileMenuId}
			keepMounted
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			{menuItems.map((item) => (
				item.link === '/technology' ? (
					<>
						<MenuItem
							key={'id-link-1'}
						>
							<Link href={'/how-it-works/frontend'} underline={item.isActive ? 'always' : 'hover'}>Фронт</Link>
						</MenuItem>
						<MenuItem
							key={'id-link-2'}
						>
							<Link href={'/how-it-works/backend'} underline={item.isActive ? 'always' : 'hover'}>Бэк</Link>
						</MenuItem>
					</>
				) : (
					<MenuItem
						key={item.link}
					>
						<Link href={item.link} underline={item.isActive ? 'always' : 'hover'}>{item.label}</Link>
					</MenuItem>
				)
			))}
		</Menu>
	)

	return (
		<Box>
			<Box
				sx={{
					display: {
						xs: 'none',
						sm: 'none',
						md: 'block',
					},
				}}
			>
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
							item.link === '/technology' ? (
								<Tooltip
									key={item.link}
									variant={'outlined'}
									title={(
										<Box
											sx={{
												maxWidth: '100px',
												display: 'flex',
												alignItems: 'center',
												flexDirection: 'column',
												justifyContent: 'center',
											}}
										>
											<Link
												level="title-lg"
												href={'/how-it-works/frontend'}
												underline={item.isActive ? 'always' : 'hover'}
											>
                                                Фронт
											</Link>
											<Link
												level="title-lg"
												href={'/how-it-works/backend'}
												underline={item.isActive ? 'always' : 'hover'}
											>
                                                Бэк
											</Link>
										</Box>
									)}
								>
									<Link
										sx={{
											height: '30px',
										}}
										level="title-lg"
										underline={item.isActive ? 'always' : 'hover'}
									>
										{item.label}
									</Link>
								</Tooltip>
							) : (
								<Link
									sx={{
										height: '30px',
									}}
									level="title-lg"
									href={item.link}
									key={item.link}
									underline={item.isActive ? 'always' : 'hover'}
								>
									{item.label}
								</Link>
							)
						))
					}
				</Paper>
			</Box>
			<Box
				sx={{
					display: {
						sm: 'block',
						md: 'none',
					},
				}}
			>
				<AppBar
					position="static"
					sx={{
						display: 'flex',
					}}
				>
					<Toolbar>
						<img
							width={'50px'}
							height={'50px'}
							src="/logo.png"
						/>
						<Typography
							level={'h2'}
						>
                            Sledilka
						</Typography>
						<Box sx={{ flexGrow: 1 }}/>
						<Box>
							<IconButton
								size="large"
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MenuIcon/>
							</IconButton>
							{renderMobileMenu}
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
		</Box>
	)
}
