import CustomedApi from '../generated/customed-api'

import { NetworkItem } from '@models'

export const fetchNetworkAddresses = async () => {
	const { data } = await CustomedApi.network.networkList()
	return data.map((networkItem) => new NetworkItem(networkItem))
}
