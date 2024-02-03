'use client'
import Image from 'next/image'
import React from 'react'

import BannerBackground from '@public/about-background.png'
import Backend from '@public/backend-image.png'
import './backend-summary-body.css'

export const BackendSummaryBody = () => {
	return (
		<div className="backend-section-container">
			<div className="backend-background-image-container">
				<Image src={BannerBackground} alt="" />
			</div>
			<div className="backend-section-image-container">
				<Image src={Backend} alt=""/>
			</div>
			<div className="backend-section-text-container">
				<h1 className="primary-heading">
					Сеть. Потоки
				</h1>
				<div className="backend-primary-text">
					Работа бэкенда заключается в хранении списка устройств в базе данных,
					получении статуса устройств в сети, обработке,
					анализе и передаче видеоизображения с камер
				</div>
			</div>
		</div>
	)
}
