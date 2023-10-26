import { AppBar, Box } from '@mui/material'
import { Typography } from '@mui/joy'

export default function LandingFooter() {
	return (
		<AppBar
			position="static"
			sx={{
				display: 'flex',
			}}
		>
			<Typography
				sx={{
					padding: '20px 0',
					textAlign: 'center',
					color: 'white',
				}}
				level={'body-sm'}
			>
				© Разработали Цатурян Геворг и Кануков Денис
			</Typography>
		</AppBar>
	)
}
