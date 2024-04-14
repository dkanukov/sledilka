import { useState } from 'react'

import { lsGetItem, lsSetItem } from '@helpers'

export const usePersistState = <T>(key: string, initialValue: T) => {
	const lsValue = lsGetItem<T>(key)
	const value = lsValue === null ? initialValue : lsValue
	const [state, setState] = useState(value)

	const updateState = (value: T) => {
		setState(value)
		lsSetItem(key, value)
	}

	return {
		state,
		updateState,
	}
}
