'use client'
import { Typography } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import styles from './camera.module.css'

import { useCamera } from '@hooks'

const { Title } = Typography

export default function Camera() {
	const searchParams = useSearchParams()
	const {
		fetchStream,
	} = useCamera(searchParams.get('cameraId') || '')

	useEffect(() => {
		const fetch = async () => {
			await fetchStream()
		}

		// fetch()
	}, [])

	return (
		<div className={styles.root}>
			<Title>Просмотр камеры</Title>
			<img src="http://localhost:8081/stream/b43614ff-0347-42b0-ba92-fd8286a1a3c5"/>
		</div>
	)
}
