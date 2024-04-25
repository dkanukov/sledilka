export const getScaleByResolution = (resolution: number, offset = 0) => {
	return Math.max(2 - (resolution + 0.2 - offset), 0)
}
