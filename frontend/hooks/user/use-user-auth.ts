import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { authService } from '@api'
import { UserCredentials, UserCredentialsKeys } from '@typos'
import { lsSetItem } from '@helpers'

export const useUserAuth = () => {
	const router = useRouter()
	const [userCredential, setUserCredential] = useState<UserCredentials>({
		userName: '',
		password: '',
	})

	const isLoginButtonDisabled = Boolean(!userCredential.password || !userCredential.userName)

	const handleFormReset = () => {
		setUserCredential({
			userName: '',
			password: '',
		})
	}

	const handleUserCredentialChange = (key: UserCredentialsKeys, value: string) => {
		setUserCredential({
			...userCredential,
			[key]: value,
		})
	}

	const handleUserLogin = async () => {
		const response = await authService.login(userCredential)

		if (response) {
			router.push('/admin')
			lsSetItem('refresh-token-retries', 2)
		}
	}

	return {
		userCredential,
		isLoginButtonDisabled,
		handleFormReset,
		handleUserCredentialChange,
		handleUserLogin,
	}
}
