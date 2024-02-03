'use client'
import Carousel from 'react-multi-carousel'
import Image from 'next/image'
import 'react-multi-carousel/lib/styles.css'
import './frontend-slides-body.css'
import React from 'react'
import { AspectRatio, Card, CardContent } from '@mui/joy'

import Png1 from '@/public/1.png'
import Png2 from '@/public/2.png'
import Png3 from '@/public/3.png'
import Png4 from '@/public/4.png'
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
					<AspectRatio
						sx={{ minWidth: 200 }}
						flex
						ratio="1"
					>
						<CardContent>
							<Image src={Png1} alt="" />
						</CardContent>
					</AspectRatio>
				</Card>
				<Card>
					<AspectRatio
						sx={{ minWidth: 200 }}
						flex
						ratio="1"
					>
						<CardContent>
							<Image src={Png2} alt="" />
						</CardContent>
					</AspectRatio>
				</Card>
				<Card>
					<AspectRatio
						sx={{ minWidth: 200 }}
						flex
						ratio="1"
					>
						<CardContent>
							<Image src={Png3} alt="" />
						</CardContent>
					</AspectRatio>
				</Card>
				<Card>
					<AspectRatio
						sx={{ minWidth: 200 }}
						flex
						ratio="1"
					>
						<CardContent>
							<Image src={Png4} alt="" />
						</CardContent>
					</AspectRatio>
				</Card>
			</Carousel>
		</div>
	)
}
export default FrontendSlidesBody
