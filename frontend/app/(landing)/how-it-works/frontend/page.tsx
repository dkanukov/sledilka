'use client'
import { FrontendSlidesBody, FrontendSummaryBody, FrontendToolsBody } from '@components'
import 'react-multi-carousel/lib/styles.css'
const Frontend = () => {
	return (
		<div>
			<div className="heading">
				Frontend
			</div>
			<FrontendSummaryBody />
			<FrontendSlidesBody />
			<FrontendToolsBody />
		</div>
	)
}
export default Frontend
