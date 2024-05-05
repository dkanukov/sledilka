'use client'
import { useState } from 'react'
import { Button, Input } from 'antd'

import styles from './auth.module.css'

import { useUserAuth } from '@hooks'

export default function SignIn() {
	const {
		userCredential,
		isLoginButtonDisabled,
		handleFormReset,
		handleUserCredentialChange,
		handleUserLogin,
	} = useUserAuth()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

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
					value={userCredential.userName}
					onChange={({ target }) => handleUserCredentialChange('userName', target.value)}
				/>
				<Input.Password
					placeholder={'Пароль'}
					size={'large'}
					className={styles.formInput}
					value={userCredential.password}
					visibilityToggle={{
						visible: isPasswordVisible,
						onVisibleChange: setIsPasswordVisible,
					}}
					onChange={({ target }) => handleUserCredentialChange('password', target.value)}
				/>
				<div
					className={styles.buttonGroup}
				>
					<Button
						type={'primary'}
						disabled={isLoginButtonDisabled}
						onClick={handleUserLogin}
					>
						Войти
					</Button>
					<Button
						danger
						onClick={handleFormReset}
					>
						Сбросить
					</Button>
				</div>
			</div>
		</div>
	)
}
