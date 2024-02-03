'use client'
import { Grid } from '@mui/joy'
import Image, { StaticImageData } from 'next/image'
import React from 'react'

import './frontend-tools-body.css'
import ReactLogo from '@public/React Logo.svg'
import MuiLogo from '@public/mui-logo.png'
import OpenLayersLogo from '@public/openlayers.png'
import CSSLogo from '@public/csslogo.png'
import HTMLLogo from '@public/html-logo.png'

export const FrontendToolsBody = () => {
	return (
		<div>
			<div className="subheading" style={{ marginTop: 100 }}>
				Инструменты разработки
			</div>
			<div style={{ marginTop: 80 }}>
				<Grid
					container
					spacing={2}
					sx={{ flexGrow: 1 }}
				>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={ReactLogo as StaticImageData} width={45}
								alt=""
							/>
							<div className="frontend-text">React/NextJS</div>
						</div>
						<div className="frontend-primary-text">
							Проект будет написан на фреймворках
							React и Next на языке TypeScript,
							что сильно упростит разработку
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={MuiLogo} width={45}
								alt=""
							/>
							<div className="frontend-text">MUI</div>
						</div>
						<div className="frontend-primary-text">
							В качестве UIKitа будет использована MUI. Она содержит
							в себе множество готовых решений и компонентов для
							совершенно разных нужд
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={OpenLayersLogo} width={45}
								alt=""
							/>
							<div className="frontend-text">OpenLayers</div>
						</div>
						<div className="frontend-primary-text">
							Библиотека с открытым исходным кодом, предназначенная для создания карт на основе программного интерфейса.
							OpenLayers позволяет легко разместить динамическую карту на любой веб-странице.
							Он может отображать фрагменты карты, векторные данные и маркеры, загруженные из любого источника.
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={HTMLLogo} width={45}
								alt=""
							/>
							<Image
								src={CSSLogo} width={45}
								alt=""
							/>
							<div className="frontend-text">HTML/CSS</div>
						</div>
						<div className="frontend-primary-text">
							Ну и куда без них...
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}
