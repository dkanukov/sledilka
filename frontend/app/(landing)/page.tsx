'use client'
import { Box, Container } from '@mui/material'
import React from 'react'

import { FunctionalityBody, LoglineBody } from '@components'

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
