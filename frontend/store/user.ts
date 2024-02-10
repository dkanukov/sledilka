import { create } from 'zustand'

import { EntityLoginInfo } from '../api/generated/api'

import { authService } from '@api'

interface UserStore {
	userCredential: EntityLoginInfo
	handleUserCredentialChange: (value: EntityLoginInfo) => void
	handleUserLogin: (value: EntityLoginInfo) => Promise<boolean>
}

export const useUserStore = create<UserStore>()((set) => ({
	userCredential: {
		username: '',
		password: '',
	},

	handleUserCredentialChange: (value) => set((state) => ({
		userCredential: {
			...state.userCredential,
			...value,
		},
	})),

	handleUserLogin: async (value: EntityLoginInfo) => {
		return await authService.login(value)
	},
}))

