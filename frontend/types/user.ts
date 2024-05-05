export interface UserCredentials {
	userName: string
	password: string
}

export type UserCredentialsKeys = keyof UserCredentials