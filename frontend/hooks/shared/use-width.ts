import { useEffect, useState } from 'react'

export const useWidth = () => {
	const [width, setWidth] = useState(0)

	const whenResize = () => setWidth(window.innerWidth)

	useEffect(() => {
		window.addEventListener('resize', whenResize)
		return () => window.removeEventListener('resize', whenResize)
	}, [whenResize])

	return width
}
