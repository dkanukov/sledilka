import { Box } from '@mui/material'
import { Typography } from '@mui/joy'

export const LandingFooter = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				bgcolor: 'info.main',
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
		</Box>
	)
}
