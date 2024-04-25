import { Icon, Style } from 'ol/style'

export const getMarkerStyle = () => {
	return new Style({
		image: new Icon({
			size: [64, 64],
			anchor: [0.5, 1],
			src: '/icon/marker.svg',
		}),
	})
}
