'use client'
import './frontend-summary-body.css'
import Image from 'next/image'
import React from 'react'

import BannerBackground from '@/public/about-background.png'
import FrontEndImg from '@/public/frontend-image.png'

const FrontendSummaryBody = () => {
	return (
		<div className="frontend-section-container">
			<div className="frontend-background-image-container">
				<Image src={BannerBackground} alt="" />
			</div>
			<div className="frontend-section-image-container">
				<Image src={FrontEndImg} alt=""/>
			</div>
			<div className="frontend-section-text-container">
				<h1 className="primary-heading">
					Интерактивная карта с объектами
				</h1>
				<div className="primary-text">
					Страница-карта с возможностью перемещения по этажам,
					добавлением новых объектов/устройств.
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
export default FrontendSummaryBody