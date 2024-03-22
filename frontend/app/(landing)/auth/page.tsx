'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from 'antd'

import styles from './auth.module.css'

import { useUserStore } from '@store'

export default function SignIn() {
	const router = useRouter()
	const userStore = useUserStore()

	const [isLoginButtonDisabled, setIsLoginButtonActive] = useState(true)
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	useEffect(() => {
		setIsLoginButtonActive(Boolean(userStore.userCredential.password && userStore.userCredential.username))
	}, [userStore.userCredential])

	const handleUserLogin = async () => {
		await userStore.handleUserLogin(userStore.userCredential)
	}

	return (
		<div
			className={styles.wrapper}
		>
			<div
				className={styles.form}
			>
				<Input
					placeholder={'Логин'}
					size={'large'}
					className={styles.formInput}
					value={userStore.userCredential.username}
					onChange={(e) => userStore.handlelUserCredentialChange({
						username: e.target.value,
					})}
				/>
				<Input.Password
					placeholder={'Пароль'}
					size={'large'}
					className={styles.formInput}
					value={userStore.userCredential.password}
					visibilityToggle={{ visible: isPasswordVisible,
						onVisibleChange: setIsPasswordVisible }}
					onChange={(e) => userStore.handlelUserCredentialChange({
						password: e.target.value,
					})}
				/>
				<div
					className={styles.buttonGroup}
				>
					<Button
						type={'primary'}
						disabled={!isLoginButtonDisabled}
						onClick={handleUserLogin}
					>
						Войти
					</Button>
					<Button
						danger
					>
						Сбросить
					</Button>
				</div>
			</div>
		</div>
	)
}
