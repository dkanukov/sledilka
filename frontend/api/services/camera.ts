import CustomedApi from '../generated/customed-api'

export const getStream = async (cameraId: string) => {
	const response = await CustomedApi.stream.streamDetail(cameraId)
	console.log(response.data)
}