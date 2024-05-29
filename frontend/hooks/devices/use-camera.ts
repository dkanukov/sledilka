import { streamService } from '@api'

export const useCamera = (cameraId: string) => {
	const fetchStream = async () => {
		await streamService.getStream(cameraId)
	}

	return {
		fetchStream,
	}
}