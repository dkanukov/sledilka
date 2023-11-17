import React from 'react'
import Image from 'next/image'

import './how-it-works-body.css'
import Neuronet from '../../public/neuronet-image.png'
import FrontEnd from '../../public/frontend-image.png'
import BackEnd from '../../public/backend-image.png'

const Page = () => {
	const workInfoData = [
		{
			image: Neuronet,
			title: 'Нейросеть',
			text: 'Будет разработана модель для определения состояния света в кабинете(вкл/выкл)',
		},
		{
			image: FrontEnd,
			title: 'FrontEnd',
			text: 'Страница в виде карты с возможностью перемещения по этажам',
		},
		{
			image: BackEnd,
			title: 'BackEnd',
			text: 'Анализ состояния по сети. Передача и анализ видеопотока с камер',
		},
	]
	return (
		<div className="work-section-wrapper" id="work">
			<div className="work-section-top">
				<h1 className="primary-heading">Как это работает?</h1>
			</div>
			<div className="work-section-bottom">
				{workInfoData.map((data) => (
					<div className="work-section-info" key={data.title}>
						<div className="info-boxes-img-container">
							<Image
								src={data.image} alt=""
								width="150"
							/>
						</div>
						<h2>{data.title}</h2>
						<p>{data.text}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Page
