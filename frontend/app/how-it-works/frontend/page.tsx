'use client'
import 'react-multi-carousel/lib/styles.css'
import FrontendSummaryBody from '@/app/components/frontend-summary-body/frontend-summary-body'
import FrontendSlidesBody from '@/app/components/frontend-slides-body/frontend-slides-body'
import FrontendToolsBody from '@/app/components/frontend-tools-body/frontend-tools-body'
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