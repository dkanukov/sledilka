import { Feature } from 'ol'
import { Translate } from 'ol/interaction'
import { Layer } from 'ol/layer'
import { Point as MapPoint } from 'ol/geom'

export type Point = [number, number]
export type Area = Point[]
export type Line = number

export type Marker = {
	layer: Layer
	translate: Translate
	feature: Feature<MapPoint>
}
