'use client'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Button, Card, CardContent, FormControl, IconButton, Input, Slider, Textarea, Typography } from '@mui/joy'
import StarRateIcon from '@mui/icons-material/StarRate'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useEffect, useState } from 'react'
import { Box, FormLabel } from '@mui/material'

import { EntityReview } from '../../../api/generated/api'

import styles from './feedback.module.css'

import { feedbackService } from '@api'

const MAX_RATE = 5

export default function Feedback() {

	const [carouselItems, setCaroseulItem] = useState<EntityReview[]>([])

	const [isShowForm, setIsShowForm] = useState(false)
	const [feedbackForm, setFeedbackForm] = useState({
		name: '',
		rate: 0,
		message: '',
	})
	const [isSendFeedbackButtonDisabled, setIsSendButtonDisabled] = useState(true)

	useEffect(() => {
		feedbackService.getFeedbacks().then((data) => setCaroseulItem(data)).catch((e) => console.log(e))
	}, [])

	useEffect(() => {
		if (feedbackForm.message && feedbackForm.name) {
			setIsSendButtonDisabled(false)
			return
		}
		setIsSendButtonDisabled(true)
	}, [feedbackForm.name, feedbackForm.message])

	const handleAddFeedbackButtonClick = () => {
		if (!isShowForm) {
			setIsShowForm(!isShowForm)
		}
	}

	const handleFeedbackFormClose = () => {
		setIsShowForm(false)
		setFeedbackForm({
			name: '',
			rate: 0,
			message: '',
		})
	}

	const createNewFeedback = async (name: string, message: string, rate: number) => {
		const isOk = await feedbackService.createFeedback({
			name,
			comment: message,
			rating: rate,
		})

		return isOk
	}

	const handleSendFeedbackButtonClick = async () => {
		const isOk = await createNewFeedback(feedbackForm.name, feedbackForm.message, feedbackForm.rate)
		if (isOk) {
			setCaroseulItem([...carouselItems, {
				...feedbackForm,
				comment: feedbackForm.message,
				name: feedbackForm.name,
				rating: feedbackForm.rate,
			}])
			handleFeedbackFormClose()
		}
	}

	return (
		<div className={styles.feedbackPage}>
			<Typography
				level="h1"
				sx={{
					textAlign: 'center',
					marginBottom: '12px',
				}}
			>
				Ваши отзывы
			</Typography>
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
				{carouselItems.map((item) => (
					<Card
						sx={{
							height: '165px',
						}}
						key={item.name}
					>
						<CardContent >
							<Typography level="h3">
								{item.name}
							</Typography>
							<Typography level="body-lg">
								{item.comment}
							</Typography>
							<div className={styles.rating}>
								{Array.from({ length: item.rating }).fill(null).map((_, idx) => (
									<StarRateIcon
										color="warning"
										key={idx}
									/>
								))}
								{Array.from({ length: MAX_RATE - item.rating }).fill(null).map((_, idx) => (
									<StarRateIcon
										key={idx}
									/>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</Carousel>
			<Typography
				level="h1"
				sx={{
					display: 'flex',
					gap: '6px',
					alignContent: 'center',
					justifyContent: 'center',
					marginTop: '12px',
				}}
			>
				Оставить отзыв
				<IconButton
					onClick={handleAddFeedbackButtonClick}
					sx={{
						marginTop: '9px',
					}}
					variant="plain"
					color="primary"
				>
					<AddBoxIcon/>
				</IconButton>
			</Typography>
			{isShowForm && (
				<Box
					sx={{
						marginTop: '20px',
						boxShadow: 2,
					}}
				>
					<div
						className={styles.form}
					>
						<div>
							<FormControl
								sx={{
									marginBottom: '20px',
								}}
							>
								<FormLabel>Ваше имя</FormLabel>
								<Input
									size="lg"
									value={feedbackForm.name}
									onChange={(event) => setFeedbackForm({
										...feedbackForm,
										name: event.target.value,
									})}
								/>
							</FormControl>
							<Typography id="rate-slider" gutterBottom>
								Оцените нашу работу
							</Typography>
							<Slider
								id="rate-slider"
								min={0}
								max={5}
								step={1}
								valueLabelDisplay="auto"
								value={feedbackForm.rate}
								onChange={(_, number) => setFeedbackForm({
									...feedbackForm,
									rate: typeof number === 'number' ? number : number[0],
								})}
							/>
						</div>
						<Textarea
							minRows={3}
							maxRows={3}
							sx={{
								margin: '20px 0',
							}}
							placeholder="Ваш комментарий по нашей работе"
							value={feedbackForm.message}
							onChange={(event) => setFeedbackForm({
								...feedbackForm,
								message: event.target.value,
							})}
						/>
						<div className={styles.buttonWrapper}>
							<Button
								disabled={isSendFeedbackButtonDisabled}
								variant="outlined"
								onClick={handleSendFeedbackButtonClick}
							>
								Отправить отзыв
							</Button>
							<Button
								onClick={handleFeedbackFormClose}
								color="danger"
								variant="outlined"
							>
								Отменить
							</Button>
						</div>
					</div>
				</Box>
			)}
		</div>
	)
}
