import type { Point, Area, Line } from '@typos'

export function getLine(firstPoint: Point, secondPoint: Point): Line {
	const [x1, y1] = firstPoint
	const [x2, y2] = secondPoint

	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

export function getRectSides(points: Area): [Line, Line] {
	if (points.length < 4) {
		return [0, 0]
	}

	const [point1, point2, point3] = points

	return [getLine(point1, point2), getLine(point2, point3)]
}

export function getCoordByDelta(coord1: number, coord2: number, delta: number) {
	return Math.max(coord1, coord2) - delta
}

export function getRotation(rectCoords: [number, number][]) {
	const p0 = rectCoords[0]
	const p1 = rectCoords[1]

	const dp = [p0[0] - p1[0], p0[1] - p1[1]]

	return Math.atan2(-dp[1], dp[0]) + Math.PI
}

export function getRectCenter(points: Area): Point {
	if (points.length < 4) {
		return [0, 0]
	}

	const point1 = points[0]
	const point2 = points[2]

	const [x1, y1] = point1
	const [x2, y2] = point2

	const xHalfDelta = Math.abs(x1 - x2) / 2
	const yHalfDelta = Math.abs(y1 - y2) / 2

	const xCenter = getCoordByDelta(x1, x2, xHalfDelta)
	const yCenter = getCoordByDelta(y1, y2, yHalfDelta)

	return [xCenter, yCenter]
}

export function getImgParams(rectCoords: Area, rotation: number, image: HTMLImageElement) {
	const c = getRectCenter(rectCoords)

	const [rectWidth, rectHeight] = getRectSides(rectCoords)
	const isRectVertical = rectHeight > rectWidth

	const size = [image.width / 2, image.height / 2]

	const p0 = isRectVertical ? rectCoords[1] : rectCoords[0]

	const sx = ((p0[0] - c[0]) * Math.cos(rotation) - (p0[1] - c[1]) * Math.sin(rotation)) / size[0]
	const sy = ((p0[0] - c[0]) * Math.sin(rotation) + (p0[1] - c[1]) * Math.cos(rotation)) / size[1]

	return {
		center: c,
		scale: [sx, sy] as [number, number],
		rotation,
		size,
	}
}
