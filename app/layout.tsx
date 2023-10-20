import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className={'container'}>
					{children}
				</div>
			</body>
		</html>
	)
}

//TODO: научиться делать второй лэйаут, чтобы в него засунуть хеддер итд, а некоторые оставлять пустыми
