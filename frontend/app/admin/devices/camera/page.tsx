'use client'
import { Typography } from 'antd'
import { useSearchParams } from 'next/navigation'

import styles from './camera.module.css'

const { Title } = Typography

export default function Camera() {
	const searchParams = useSearchParams()

	return (
		<div className={styles.root}>
			<Title>Просмотр камеры</Title>
			<img
				className={styles.video}
				src={`http://localhost:8081/stream/${searchParams.get('cameraId')}`}
			/>
			{/*<video>*/}
			{/*	<source src={`http://localhost:8081/stream/${searchParams.get('cameraId')}`}/>*/}
			{/*</video>*/}
		</div>
	)
}

