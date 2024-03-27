import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface LocationRaw {
	path: string
	query?: Record<string, string[]>
}

export const useCustomRouter = () => {
	const router = useRouter()
	const path = usePathname()
	const query = useSearchParams()

	const createQueryString = (queryRaw: Record<string, string[]>) => {
		return Object.entries(queryRaw).reduce((acc, [key, value]) => {
			value.forEach((v) => {
				acc = acc.concat(key, '=', v, '&')
			})
			return acc
		}, '?')
	}

	const customRouter = {
		push: (location: LocationRaw) => {
			if (location.query) {
				router.push(location.path + createQueryString(location.query))
				return
			}
			router.push(location.path)
		},
		query,
	}

	return {
		path,
		query,
		customRouter,
	}
}