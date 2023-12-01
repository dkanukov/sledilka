'use client'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Button, Card, CardContent, FormControl, IconButton, Input, Slider, Textarea, Typography } from '@mui/joy'
import StarRateIcon from '@mui/icons-material/StarRate'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useEffect, useState } from 'react'
import { Box, FormLabel } from '@mui/material'
import useSWR from 'swr'
import axios from 'axios'

import { API_ROUTE } from '../api/path'

import styles from './feedback.module.css'

const MAX_RATE = 5

export default function Feedback() {
	const test = useSWR(`${API_ROUTE}/review`, async () => {
		const { data } = await axios.get(`${API_ROUTE}/review`)
		setCaroseulItem(data.map((item: any) => {
			return {
				name: item.name,
				message: item.comment,
				rate: item.rating,
			}
		}))
	})

	const createNewFeedback = async (name: string, message: string, rate: number) => {
		/* const { data, error } = await axios.post(`${API_ROUTE}/review`, {
			data: {
				name: name,
				comment: message,
				rating: rate,
			},
		}) */

		const response = await fetch(`${API_ROUTE}/review`, {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				comment: message,
				rating: rate,
			}),
		})

		// return !error
	}

	const [carouselItems, setCaroseulItem] = useState([
		{
			name: 'Testname Testsurname 1',
			message: 'test texttest texttest texttest texttest texttest texttest texttest texttest text',
			rate: 3,
		},
		{
			name: 'Testname Testsurname 2',
			message: '123',
			rate: 2,
		},
		{
			name: 'Testname Testsurname 3',
			message: '123',
			rate: 5,
		},
		{
			name: 'Testname Testsurname 4',
			message: '123',
			rate: 4,
		},
		{
			name: 'Testname Testsurname 5',
			message: '123',
			rate: 4,
		},
	])

	const [isShowForm, setIsShowForm] = useState(false)
	const [feedbackForm, setFeedbackForm] = useState({
		name: '',
		rate: 0,
		message: '',
	})
	const [isSendFeedbackButtonDisabled, setIsSendButtonDisabled] = useState(true)

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

	const handleSendFeedbackButtonClick = async () => {
		console.log(feedbackForm)
		await createNewFeedback(feedbackForm.name, feedbackForm.message, feedbackForm.rate)
		setCaroseulItem([...carouselItems, {
			...feedbackForm,
		}])
		handleFeedbackFormClose()
	}

	return (
		<div>
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
								{item.message}
							</Typography>
							<div className={styles.rating}>
								{Array.from({ length: item.rate }).fill(null).map((_, idx) => (
									<StarRateIcon
										color="warning"
										key={idx}
									/>
								))}
								{Array.from({ length: MAX_RATE - item.rate }).fill(null).map((_, idx) => (
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
