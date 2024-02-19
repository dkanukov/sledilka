import CustomedApi from '../generated/customed-api'

import { ObjectStorage } from '@models'

export const getObjects = async () => {
	const { data } = await CustomedApi.objects.objectsList()

	return data.map((object) => new ObjectStorage(object))
}
