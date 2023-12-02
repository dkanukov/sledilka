'use client'
import React from 'react'
import Image from 'next/image'

import './functionality-body.css'
import AboutBackgroundImage from '@/public/about-background-image.png'
import AboutBackground from '@/public/about-background.png'
const FunctionalityBody = () => {
	return (
		<div className="functionality-section-container" id="about">
			<div className="functionality-section-image-container">
				<Image src={AboutBackgroundImage} alt=""/>
			</div>
			<div className="functionality-section-text-container">
				<h1 className="primary-heading">
                  ПК. Камеры. Кабинеты.
				</h1>
				<ol className="primary-text" >
					{/* <li>ПО для сбора устройств в сети и сохранения их в базу данных</li> */}
					<li style={{ padding: 5 }}>Страница с текущим состоянием устройств</li>
					<li style={{ padding: 5 }}>Интерфейс расположения устройств на схеме</li>
					<li style={{ padding: 5 }}>Cоздание объектов и добавления слоев на карту</li>
					<li style={{ padding: 5 }}>Модель определяющая уровень света в помещении по камере</li>
					<li style={{ padding: 5 }}>Просмотр видео с камер</li>
				</ol>

			</div>
			<div
				className="functionality-background-image-container"
			>
				<Image
					style={{
						height: '100%',
						width: '100%',
						objectFit: 'contain',
					}}
					src={AboutBackground} alt=""
				/>
			</div>
		</div>
	)
}

export default FunctionalityBody
