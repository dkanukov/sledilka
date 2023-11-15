'use client'
import Image from 'next/image'
import React from 'react'

import './backend-summary-body.css'
import BannerBackground from '@/public/about-background.png'
import BackEnd from '@/public/backend-image.png'

const BackendSummaryBody = () => {
	return (
		<div className="backend-section-container">
			<div className="backend-background-image-container">
				<Image src={BannerBackground} alt="" />
			</div>
			<div className="backend-section-image-container">
				<Image src={BackEnd} alt=""/>
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
				{/*<ol className="primary-text" >*/}
				{/*	/!* <li>ПО для сбора устройств в сети и сохранения их в базу данных</li> *!/*/}
				{/*	<li style={{ padding: 5 }}>Страница с текущим состоянием устройств</li>*/}
				{/*	<li style={{ padding: 5 }}>Интерфейс расположения устройств на схеме</li>*/}
				{/*	<li style={{ padding: 5 }}>Cоздание объектов и добавления слоев на карту</li>*/}
				{/*	<li style={{ padding: 5 }}>Модель определяющая уровень света в помещении по камере</li>*/}
				{/*	<li style={{ padding: 5 }}>Просмотр видео с камер</li>*/}
				{/*</ol>*/}

			</div>
		</div>
	)
}

export default BackendSummaryBody