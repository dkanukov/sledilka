import { OSM } from 'ol/source'
import { Tile as TileLayer } from 'ol/layer'

export class MapLayer extends TileLayer<OSM> {
	constructor() {
		const source = new OSM()

		super({
			preload: 4,
			source,
			visible: true,
			zIndex: 0,
		})
	}
}
