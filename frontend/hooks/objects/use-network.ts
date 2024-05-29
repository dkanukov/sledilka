import { useEffect, useState } from 'react'

import { networkService } from '@api'
import { NetworkItem } from '@models'

export const useNetwork = () => {
	const [networkItems, setNetworkItems] = useState<NetworkItem[]>([])

	useEffect(() => {
		const fetchData = async () => {
			const data = await networkService.fetchNetworkAddresses()
			setNetworkItems(data)
		}
		fetchData().catch(() => console.log('не получили адреса сети'))
	}, [])

	return {
		networkItems,
	}
}