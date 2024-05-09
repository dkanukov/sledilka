import { Coordinate } from 'ol/coordinate'
import { useRouter } from 'next/navigation'

import { objectService } from '@api'

export const useCreateObject = () => {
	const router = useRouter()

	const handleCreateObject = async ({ address, description, coord, name } : {
		address: string
		description: string
		coord: Coordinate
		name: string
	}) => {
		const object = await objectService.createObject({
			address,
			description,
			lat: coord[0],
			long: coord[1],
			name,
		})

		if (object) {
			router.push(`/admin/${object.id}`)
		}
	}

	return {
		handleCreateObject,
	}
}
