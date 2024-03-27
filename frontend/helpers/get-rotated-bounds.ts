import { LatLngBoundsLiteral } from 'leaflet'

export const radiansToDegress = (radians: number) => {
	return radians * (180 / Math.PI)
}

export const getRotatedBounds = (radians: number, originalBounds: LatLngBoundsLiteral): LatLngBoundsLiteral => {
	const centerLatLng = [
		originalBounds[0][0] + (originalBounds[1][0] - originalBounds[0][0]) / 2,
		originalBounds[0][1] + (originalBounds[1][1] - originalBounds[0][1]) / 2,
	]

	return originalBounds.map((latlng) => {
		const deltaLat = latlng[0] - centerLatLng[0];
		const deltaLng = latlng[1] - centerLatLng[1];
		const rotatedDeltaLat = deltaLng * Math.sin(radians) + deltaLat * Math.cos(radians);
		const rotatedDeltaLng = deltaLng * Math.cos(radians) - deltaLat * Math.sin(radians);
		return [centerLatLng[0] + rotatedDeltaLat, centerLatLng[1] + rotatedDeltaLng];
	});
};

// export const getRotatedBounds = (originalBounds: [[number, number], [number, number]], rotationAngle: number) => {
// 	// Convert rotation angle to radians
// 	const angleRad = rotationAngle * Math.PI / 180
//
// 	// Get center point of original bounds
// 	const centerLat = (originalBounds[0][0] + originalBounds[1][0]) / 2
// 	const centerLng = (originalBounds[0][1] + originalBounds[1][1]) / 2
//
// 	// Get distances from center to corners
// 	const dLat = (originalBounds[1][0] - originalBounds[0][0]) / 2
// 	const dLng = (originalBounds[1][1] - originalBounds[0][1]) / 2
//
// 	// Calculate new corner positions after rotation
// 	const newBounds = [
// 		[
// 			centerLat + dLat * Math.cos(angleRad) - dLng * Math.sin(angleRad),
// 			centerLng + dLat * Math.sin(angleRad) + dLng * Math.cos(angleRad),
// 		],
// 		[
// 			centerLat - dLat * Math.cos(angleRad) - dLng * Math.sin(angleRad),
// 			centerLng + dLat * Math.sin(angleRad) - dLng * Math.cos(angleRad),
// 		],
// 	]
//
// 	return newBounds
// }