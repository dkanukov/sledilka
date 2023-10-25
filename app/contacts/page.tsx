'use client'
import { useState } from 'react'
import { AspectRatio, Box, Card, CardContent, Chip, Grid, IconButton, Link, Typography } from '@mui/joy'
import { ThumbDown, ThumbUp } from '@mui/icons-material'

import styles from './contacts.module.css'

export default function Contacts() {
	const [gevorgLikes, setGevorgLikes] = useState(0)
	const [gevorgDislikes, setGevorgDislikes] = useState(100)
	const [denisLikes, setDenisLikes] = useState(100)
	const [denisDislikes, setDenisDislikes] = useState(-42)

	const handleGevorgLike = () => setGevorgLikes(gevorgLikes + 1)

	const handleGevorgDislike = () => setGevorgDislikes(gevorgDislikes + 1)

	const handleDenisLike = () => setDenisLikes(denisLikes + 1)

	return (
		<div>
			<Grid
				spacing={2}
				container
			>
				<Grid
					xs={12}
					sm={12}
					md={6}
					lg={6}
				>
					<Card
						orientation="horizontal"
					>
						<AspectRatio
							sx={{ minWidth: 200 }}
							flex
							ratio="1"
						>
							<img
								src="/gevorg.jpeg"
								alt=""
							/>
						</AspectRatio>
						<CardContent>
							<Typography
								level="h2"
							>
							Цатурян Геворг
							</Typography>
							<Typography
								level="body-sm"
							>
							Студент 4ого курса ИВТ
							</Typography>
							<Typography
								sx={{
									marginTop: '10px',
								}}
								level="body-lg"
							>
							Номер телефона:	<Link href="tel: +7(926)-679-01-45"> +7(926)-679-01-45 </Link>
							</Typography>
							<Typography
								level="body-lg"
							>
							email: <Link href="mailto:gev.tsat@gmail.com">gev.tsat@gmail.com</Link>
							</Typography>

							<div className={styles.likes}>
								<IconButton
									sx={{
										display: 'flex',
										gap: '8px',
									}}
									onClick={handleGevorgLike}
								>
									{gevorgLikes}
									<ThumbUp
										sx={{
											margintop: '-5px',
										}}
									/>
								</IconButton>
								<IconButton
									sx={{
										display: 'flex',
										gap: '8px',
									}}
									onClick={handleGevorgDislike}
								>
									{gevorgDislikes}
									<ThumbDown
										sx={{
											margintop: '-5px',
										}}
									/>
								</IconButton>
							</div>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					xs={12}
					sm={12}
					md={6}
					lg={6}
				>
					<Card
						orientation="horizontal"
					>
						<AspectRatio
							sx={{ minWidth: 200 }}
							flex
							ratio="1"
						>
							<img
								src="/denis.jpeg"
								alt=""
							/>
						</AspectRatio>
						<CardContent>
							<Typography
								level="h2"
							>
								Кануков Денис
							</Typography>
							<Typography
								level="body-sm"
							>
							Студент 4ого курса ИВТ
							</Typography>
							<Typography
								sx={{
									marginTop: '10px',
								}}
								level="body-lg"
							>
							Номер телефона: <Link href="tel:89857282003">+7(985)728-20-03</Link>
							</Typography>
							<Typography
								level="body-lg"
							>
							email: <Link href="mailto:kanu.denis@gmail.com">kanu.denis@gmail.com</Link>
							</Typography>

							<div className={styles.likes}>
								<IconButton
									sx={{
										display: 'flex',
										gap: '8px',
									}}
									onClick={handleDenisLike}
								>
									{denisLikes}
									<ThumbUp
										sx={{
											margintop: '-5px',
										}}
									/>
								</IconButton>
								<IconButton
									disabled
									sx={{
										display: 'flex',
										gap: '8px',
									}}
								>
									{denisDislikes}
									<ThumbDown
										sx={{
											margintop: '-5px',
										}}
									/>
								</IconButton>
							</div>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					xs={12}
					sm={12}
					md={12}
					lg={12}
				>
					<Card
						orientation="horizontal"
					>
						<AspectRatio
							sx={{ minWidth: 200 }}
							flex
							ratio="1"
						>
							<img
								src="/nadejda.jpeg"
								alt=""
							/>
						</AspectRatio>
						<CardContent>
							<Typography
								level="h2"
							>
								Трубочкина Надежда Константиновна
							</Typography>
							<Typography
								level="body-sm"
							>
								Руководитель
							</Typography>
							<div className={styles.contacts}>
								<Typography
									sx={{
										marginTop: '10px',
										display: 'flex',
										gap: '5px',
									}}
									level="body-lg"
								>

								</Typography>								Номер телефона:
								<Chip
									size="sm"
									variant="solid"
									color="danger"
								>
									TOP SECRET
								</Chip>
							</div>

							<div className={styles.contacts}>
								<Typography
									sx={{
										display: 'flex',
										gap: '5px',
									}}
									level="body-lg"
								>

								</Typography>
							email:
								<Chip
									size="sm"
									variant="solid"
									color="danger"
								>
									TOP SECRET
								</Chip>

							</div>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Box
				sx={{
					marginTop: '10px',
				}}
			>
				<iframe
					src="https://yandex.ru/map-widget/v1/?um=constructor%3A74af39facb337d144cfd686260e59d621e1450d8335b89c25ed0a17cd536d2cd&amp;source=constructor" width={'100%'}
					height="452" frameborder="0"
				>
				</iframe>
			</Box>
		</div>
	)
}
