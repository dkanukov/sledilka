import { Box, Container } from '@mui/material'
import React from 'react'

import LoglineBody from './components/logline-body/logline-body'
import FunctionalityBody from './components/functionality-body/functionality-body'

export default function Landing() {
	return (
		<Box>
			<h1 className="heading">
				Следилка это who?
			</h1>
			<LoglineBody />
			<FunctionalityBody />
		</Box>
	)
}
