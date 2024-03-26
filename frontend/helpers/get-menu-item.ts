import React from 'react'

import { MenuItem } from '@typos'

export const getMenuItem = ({
	label,
	key,
	icon,
	type,
	children,
}: {
	label: React.ReactNode
	key: React.Key
	icon?: React.ReactNode
	type?: 'group' | 'divider'
	children?: MenuItem[]
}): MenuItem => ({
	label,
	key,
	icon,
	type,
	children,
})

