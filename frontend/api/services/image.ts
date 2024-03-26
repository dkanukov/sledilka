import { v4 as uuidv4 } from 'uuid'

import CustomedApi from '../generated/customed-api'

export const uploadImage = async (file: File) => {
	const response = await CustomedApi.images.imagesCreate({
		request: file,
	})

	return response
}
