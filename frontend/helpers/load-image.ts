/* eslint-disable compat/compat */
export const loadImage = (imgUrl: string): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = imgUrl

		img.onload = () => resolve(img)
		img.onerror = () => reject()
	})
}
