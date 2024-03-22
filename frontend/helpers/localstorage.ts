export const lsGetItem = <T>(key: string): T | null => {
	try {
		const rawData = localStorage.getItem(key)

		if (rawData === null) {
			throw new Error('Data is empty')
		}

		const data: T = JSON.parse(rawData)

		return data
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`localStorageStore error: ${e}`)

		return null
	}
}

export const lsSetItem = <T>(key: string, value: T) => {
	const preparedData = JSON.stringify(value)

	localStorage.setItem(key, preparedData)
}

export const lsRemoveItem = (key: string) => {
	localStorage.removeItem(key)
}
