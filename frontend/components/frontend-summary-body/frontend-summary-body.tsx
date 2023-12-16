'use client'
import './frontend-summary-body.css'
import Image from 'next/image'
import React from 'react'

import BannerBackground from '@public/about-background.png'
import FrontEndImg from '@public/frontend-image.png'

export const FrontendSummaryBody = () => {
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
			</div>
		</div>
	)
}
