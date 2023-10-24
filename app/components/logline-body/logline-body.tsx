import React from 'react'
import Image from 'next/image'

import './logline-body.css'
import BannerBackground from '../../../public/home-banner-background.png'
import BannerImage from '../../../public/home-banner-image.png'

const LoglineBody = () => {
	return (
		<div className="home-container" id="home">
			{/*<Navbar />*/}
			<div className="logline-banner-container">
				<div className="logline-bannerImage-container">
					<Image src={BannerBackground} alt="" />
				</div>
				<div className="logline-text-section">
					<h1 className="primary-heading">
            Инфосистема отслеживания состояний устройств
					</h1>
					<p className="primary-text">
            Интерфейсы для визуализации устройств и их режима работы в сети
					</p>
					{/* <button className="secondary-button">
            Order Now <FiArrowRight />{" "}
          </button> */}
				</div>
				<div className="logline-image-section">
					<Image src={BannerImage} alt="" />
				</div>
			</div>
		</div>
	)
}

export default LoglineBody
