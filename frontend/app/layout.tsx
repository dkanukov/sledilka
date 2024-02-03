'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
const inter = Inter({ subsets: ['latin'] })

export default function LandingLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<AntdRegistry>
				<body className={inter.className}>
					{children}
				</body>
			</AntdRegistry>
		</html>
	)
}
