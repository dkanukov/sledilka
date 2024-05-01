'use client'
import { Typography } from 'antd'

import styles from './camera.module.css'

const { Title } = Typography

export default function Camera() {
	return (
		<div className={styles.root}>
			<Title>Просмотр камеры</Title>
		</div>
	)
}
