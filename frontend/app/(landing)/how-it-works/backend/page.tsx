import React from 'react'

import '../how-it-works-body.css'
import { BackendSummaryBody, BackendToolsBody } from '@components'
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
