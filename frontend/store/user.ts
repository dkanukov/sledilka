import { create } from 'zustand'

import { EntityLoginInfo } from '../api/generated/api'

import { authService } from '@api'

interface UserStore {
	userCredential: EntityLoginInfo
	handlelUserCredentialChange: (value: EntityLoginInfo) => void
	handleUserLogin: (value: EntityLoginInfo) => Promise<void>
}

export const useUserStore = create<UserStore>()((set) => ({
	userCredential: {
		username: '',
		password: '',
	},

	handlelUserCredentialChange: (value) => set((state) => ({
		userCredential: {
			...state.userCredential,
			...value,
		},
	})),

	handleUserLogin: async (value: EntityLoginInfo) => {
		const res = await authService.login(value)
		console.log(res)
	},
}))

