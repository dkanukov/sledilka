export const degreeToRadian = (degrees: number) => {
	return degrees * Math.PI / 180
}

export const radianToDegree = (radian: number) => {
	const coefficient = 180 / Math.PI

	return radian < 0 ? 360 + radian * coefficient : radian * coefficient
}
