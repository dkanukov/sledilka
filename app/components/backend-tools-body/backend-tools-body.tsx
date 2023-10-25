import React from 'react'
import '../backend-summary-body/backend-summary-body.css'
import './backend-tools-body.css'
import Image from 'next/image'
import { Grid } from '@mui/joy'

import GstreamerIcon from '../../../public/gstreamer icon.svg'
import Gopher from '../../../public/gopher.png'
import PostgresIcon from '../../../public/Postgresql.png'
import LinuxLogo from '../../../public/linux.png'
const BackendToolsBody = () => {
	return (
		<div>
			<div
				className="heading" style={{ maxWidth: 900,
					marginTop: 20 }}
			>
				Инструменты разработки
			</div>
			<div style={{ marginTop: 80 }}>
				<Grid
					container spacing={2}
					sx={{ flexGrow: 1 }}
				>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={Gopher} width={45}
								alt=""
							/>
							<div className="backend-text">Golang</div>
						</div>
						<div className="primary-text">
							Сервер будет написан на языке Go.
							Это достаточно легковесный и &quot;быстрый&quot; язык,
							чьи даже базовые инструменты позволяют просто создать HTTP-сервер,
							подключиться и взаимодействовать с базой данных
							{/*Также он активно набирает популярность, так что проект будет классной строчкой в резюме)*/}
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={PostgresIcon} width={45}
								alt=""
							/>
							<div className="backend-text">PostgreSQL</div>
						</div>
						<div className="primary-text">
							База данных будет на СУБД Postgres.
							Там будет хранится информация об устройствах (их тип, mac-адреса),
							пользователях (логин, хэш пароля, права доступа, ФИО), а также
							о расположении объектов и слоях карты
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={LinuxLogo} width={45}
								alt=""
							/>
							<div className="backend-text">Linux net-tools</div>
						</div>
						<div className="primary-text">
							Для получении информации о статусах устройств в сети
							будут использованы встроенные утилиты дистрибутивов Linux
							и также другие консольные программы, анализирующие сеть, например arp-scan
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={GstreamerIcon} width={45}
								alt=""
							/>
							<div className="backend-text">gstreamer/ffmpeg</div>
						</div>
						<div className="primary-text">
							Связка ffmpeg/gstreamer будут использоваться для подключения к камере,
							считывания видеоизображения, преобразования его в нужный формат для
							передачи по сети
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}

export default BackendToolsBody