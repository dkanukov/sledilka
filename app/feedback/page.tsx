'use client'
import Carousel from 'react-multi-carousel'

import 'react-multi-carousel/lib/styles.css'
import { Card, CardContent, Typography } from '@mui/joy'

import styles from './feedback.module.css'

const CAROUSEL_ITEMS = [
	{
		text: '123',
	},
	{
		text: '123',
	},
	{
		text: '123',
	},	{
		text: '123',
	},
]
export default function Feedback() {
	return (
		<div>
			<Carousel
				additionalTransfrom={0}
				arrows
				autoPlaySpeed={3000}
				centerMode={false}
				className=""
				containerClass={styles.carousel}
				dotListClass=""
				draggable
				focusOnSelect={false}
				infinite
				itemClass=""
				keyBoardControl
				minimumTouchDrag={80}
				pauseOnHover
				renderArrowsWhenDisabled={false}
				renderButtonGroupOutside={false}
				renderDotsOutside={false}
				responsive={{
					desktop: {
						breakpoint: {
							max: 3000,
							min: 1024,
						},
						items: 3,
						partialVisibilityGutter: 40,
					},
					mobile: {
						breakpoint: {
							max: 464,
							min: 0,
						},
						items: 1,
						partialVisibilityGutter: 30,
					},
					tablet: {
						breakpoint: {
							max: 1024,
							min: 464,
						},
						items: 2,
						partialVisibilityGutter: 30,
					},
				}}
				rewind={false}
				rewindWithAnimation={false}
				rtl={false}
				shouldResetAutoplay
				showDots={false}
				sliderClass=""
				slidesToSlide={1}
				swipeable
			>
				<Card>
					<CardContent>
						<Typography level="h3">
							Name Name
						</Typography>
					</CardContent>
				</Card>
			</Carousel>
		</div>
	)
}
