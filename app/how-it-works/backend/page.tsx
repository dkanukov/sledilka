import React from 'react'
import Image from 'next/image'

import BackendSummaryBody from '../../components/backend-summary-body/backend-summary-body'
import BackendToolsBody from '../../components/backend-tools-body/backend-tools-body'
import '../how-it-works-body.css'
const Backend = () => {
	return (
		<div>
			<h1 className="heading">
			Backend
			</h1>
			<BackendSummaryBody />
			<BackendToolsBody />
		</div>
	)
}

export default Backend