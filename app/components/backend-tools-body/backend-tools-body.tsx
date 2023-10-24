import React from 'react'
import '../backend-summary-body/backend-summary-body.css'
import './backend-tools-body.css'
import Image from 'next/image'
import { Grid } from '@mui/joy'

import GstreamerIcon from '../../../public/gstreamer icon.svg'
import Gopher from '../../../public/gopher.png'
import PostgresIcon from '../../../public/Postgresql.png'
const BackendToolsBody = () => {
	return (
		<div>
			<div
				className="heading" style={{ maxWidth: 900,
					marginTop: 20 }}
			>
				Инструменты разработки
			</div>
			<div style={{ marginTop: 20 }}>
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
							<div className="backend-text">golang</div>
						</div>
						<div className="primary-text">
							LEEEEEETS GOOOOOOOO
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={PostgresIcon} width={40}
								alt=""
							/>
							<div className="backend-text">PostgreSQL</div>
						</div>
						<div className="primary-text">
							gstreamer используется для того чтобы бла бла бла
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={GstreamerIcon} width={40}
								alt=""
							/>
							<div className="backend-text">linux tools</div>
						</div>
						<div className="primary-text">
							gstreamer используется для того чтобы бла бла бла
						</div>
					</Grid>
					<Grid xs={12} md={6}>
						<div className="tools-list-container">
							<Image
								src={GstreamerIcon} width={40}
								alt=""
							/>
							<div className="backend-text">gstreamer</div>
						</div>
						<div className="primary-text">
							gstreamer используется для того чтобы бла бла бла
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}

export default BackendToolsBody