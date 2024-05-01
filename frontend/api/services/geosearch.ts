import axios from 'axios'

import { Location } from '@models'

const BASE_URL = 'https://geocode-maps.yandex.ru/1.x?apikey=eec37a3a-9c10-49b0-9bed-3a757cc0e425'

export const search = async (query: string) => {
	const { data } = await axios.get(`${BASE_URL}&geocode=${query}&format=json&kind=street&results=50`)

	return data.response.GeoObjectCollection.featureMember.map(({ GeoObject: geoObject }: any) => {
		const points = geoObject.Point.pos.split(' ')
		return new Location({
			address: geoObject.name,
			description: geoObject.description,
			lan: Number(points[0]),
			lot: Number(points[1]),
		})
	})
}
