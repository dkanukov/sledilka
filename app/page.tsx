"use client"
import * as React from 'react';
import {Box, Grid, Link, Checkbox, FormControlLabel, TextField, CssBaseline, Button, Avatar, Typography, Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useState} from "react";
import {useRouter} from 'next/navigation';
import {metadata} from "@/app/layout";

function Copyright(props: any) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default function SignIn() {
	const router = useRouter()
	const [userName, setUserName] = useState('')
	const [userPassword, setUserPassword] = useState('')

	const handleUserNameInput = (value: string) => {
		setUserName(value)
	}

	const handlePasswordInput = (value: string) => {
		setUserPassword(value)
	}

	const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		if (userPassword === 'root' && userPassword === 'root') {
			console.log(userPassword, userName)
			router.push('/devices-overview')
		}
	}

	return (
		<Container>
			<CssBaseline/>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
					<LockOutlinedIcon/>
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box sx={{mt: 1}}>
					<TextField
						margin="normal"
						required
						fullWidth
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						value={userName}
						onChange={(event) => handleUserNameInput(event.target.value)}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						autoComplete="current-password"
						value={userPassword}
						onChange={(event) => handlePasswordInput(event.target.value)}
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary"/>}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{mt: 3, mb: 2}}
						onClick={handleFormSubmit}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="#" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{mt: 8, mb: 4}}/>
		</Container>
	);
}
