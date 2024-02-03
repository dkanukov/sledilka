'use client'
import * as React from 'react'
import { Box, Grid, Link, Checkbox, FormControlLabel, TextField, CssBaseline, Button, Avatar, Typography, Container } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { authService } from '@api'

export default function SignIn() {
	const router = useRouter()
	const [isShowError, setIsShowError] = useState(false)


	const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const isOk = await authService.login({
			username: userName,
			password: userPassword,
		})

		if (!isOk) {
			setIsShowError(true)
			return
		}

		router.push('/admin')
		setIsShowError(false)
		return
	}

	return (
	)
}
