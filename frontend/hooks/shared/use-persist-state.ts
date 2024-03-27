import { useState } from 'react'

import { lsGetItem, lsSetItem } from '@helpers'

export const usePersistState = <T>(key: string, initialValue: T) => {
	const value = lsGetItem<T>(key) || initialValue
	const [state, setState] = useState(value)

	lsSetItem(key, state)

	const updateState = (value: T) => {
		setState(value)
		lsSetItem(key, value)
	}

	return {
		state,
		updateState,
	}
}
