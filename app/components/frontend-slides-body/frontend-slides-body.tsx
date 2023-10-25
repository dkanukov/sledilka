'use client'
import Carousel from 'react-multi-carousel'
import Image from 'next/image'
import 'react-multi-carousel/lib/styles.css'
import './frontend-slides-body.css'
import { Card, CardContent } from '@mui/joy'
import React from 'react'

import Gevorg from '@/public/gevorg.jpeg'
const FrontendSlidesBody = () => {
	return (
		<div>
			<div className="subheading">
				Референсы
			</div>
			<Carousel
				additionalTransfrom={0}
				arrows
				autoPlaySpeed={3000}
				centerMode={false}
				className=""
				containerClass="carousel"
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
				{/*TODO change photos to map-examples*/}
				<Card>
					<CardContent>
						<Image src={Gevorg} alt="" />
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<Image src={Gevorg} alt="" />
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<Image src={Gevorg} alt="" />
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<Image src={Gevorg} alt="" />
					</CardContent>
				</Card>
			</Carousel>
		</div>
	)
}
export default FrontendSlidesBody