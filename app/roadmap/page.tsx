'use client'
import { Box, Button, Grid, MobileStepper, Step, StepButton, StepLabel, Stepper } from '@mui/material'
import { Typography } from '@mui/joy'
import { useState } from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'

const STEPS = [
	{
		label: 'Развиваем фронтенд',
		lead: 'Красивые кнопочки?',
		description: 'asdf',
	},
	{
		label: 'Пишем апишку и круды',
		lead: 'Доставим JSON из точки A в точку Б',
		description: 'asdf',
	},
	{
		label: 'Хайпим на нейросетях',
		lead: 'А не поздно ли?',
		description: 'fsadfasd',
	},
	{
		label: 'Тестируем на локальных сетях',
		lead: 'Спасибо МИЭМУ за лабы!',
		description: 'fsadfasd',
	},
	{
		label: 'Выходим на финишную прямую',
		lead: 'Собираем фидбэк и вносим правки',
		description: 'fsadfasd',
	},
	{
		label: 'Открытый релиз системы',
		lead: 'Мы готовы! А вы?',
		description: 'fsadfasd',
	},
]

export default function Roadmap() {
	const [activeStep, setActiveStep] = useState(0)

	const handleShowNextStep = () => {
		setActiveStep(activeStep + 1)
	}

	const handleShowPreviousStep = () => {
		setActiveStep(activeStep - 1)
	}

	const handleLastStepClick = () => {
		setActiveStep(0)
	}

	return (
		<Box>
			<Box
				sx={{
					display: {
						xs: 'none',
						sm: 'none',
						md: 'block',
					},
				}}
			>
				<Stepper
					activeStep={activeStep}
				>
					{STEPS.map((step, idx) => (
						<Step
							key={idx}
						>
							<StepButton>
								{step.lead}
							</StepButton>
						</Step>
					))}
				</Stepper>
			</Box>
			<Box>
				<Typography
					color="neutral"
					level="title-lg"
					noWrap={false}
					variant="plain"
					sx={{
						marginTop: '20px',
					}}
				>
					{STEPS[activeStep].description}
				</Typography>
				<Box
					sx={{
						display: {
							xs: 'none',
							sm: 'none',
							md: 'block',
						},
					}}
				>
					<Grid
						container
						justifyContent={'space-between'}
						sx={{
							marginTop: '20px',
						}}
					>
						<Button
							disabled={activeStep === 0}
							variant={'contained'}
							startIcon={<NavigateBeforeIcon/>}
							onClick={handleShowPreviousStep}
						>
							Я что-то не понял :(
						</Button>
						{activeStep === STEPS.length - 1 ? (
							<Button
								variant={'contained'}
								color={'success'}
								onClick={handleLastStepClick}
							>
								Вот и все!
							</Button>
						) : (
							<Button
								disabled={activeStep === STEPS.length - 1}
								variant={'contained'}
								endIcon={<NavigateNextIcon/>}
								onClick={handleShowNextStep}
							>
								Дальше!
							</Button>
						)}
					</Grid>
				</Box>
			</Box>
			<Box
				sx={{
					display: {
						sm: 'block',
						md: 'none',
					},
				}}
			>
				<MobileStepper
					steps={STEPS.length - 1}
					activeStep={activeStep}
					backButton={(
						<Button
							disabled={activeStep === 0}
							variant={'contained'}
							startIcon={<NavigateBeforeIcon/>}
							onClick={handleShowPreviousStep}
						>
							Я что-то не понял :(
						</Button>
					)}
					nextButton={activeStep === STEPS.length - 1 ? (
						<Button
							variant={'contained'}
							color={'success'}
							onClick={handleLastStepClick}
						>
							Вот и все!
						</Button>
					) : (
						<Button
							disabled={activeStep === STEPS.length - 1}
							variant={'contained'}
							endIcon={<NavigateNextIcon/>}
							onClick={handleShowNextStep}
						>
							Дальше!
						</Button>
					)}
				/>
			</Box>
			{/*<Box>*/}
			{/*	<Typography*/}
			{/*		color="neutral"*/}
			{/*		level="title-lg"*/}
			{/*		noWrap={false}*/}
			{/*		variant="plain"*/}
			{/*		sx={{*/}
			{/*			marginTop: '20px',*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		{STEPS[activeStep].description}*/}
			{/*	</Typography>*/}
			{/*	<Grid*/}
			{/*		container*/}
			{/*		justifyContent={'space-between'}*/}
			{/*		sx={{*/}
			{/*			marginTop: '20px',*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<Button*/}
			{/*			disabled={activeStep === 0}*/}
			{/*			variant={'contained'}*/}
			{/*			startIcon={<NavigateBeforeIcon/>}*/}
			{/*			onClick={handleShowPreviousStep}*/}
			{/*		>*/}
			{/*			Я что-то не понял :(*/}
			{/*		</Button>*/}
			{/*		{activeStep === STEPS.length - 1 ? (*/}
			{/*			<Button*/}
			{/*				variant={'contained'}*/}
			{/*				color={'success'}*/}
			{/*				onClick={handleLastStepClick}*/}
			{/*			>*/}
			{/*				Вот и все!*/}
			{/*			</Button>*/}
			{/*		) : (*/}
			{/*			<Button*/}
			{/*				disabled={activeStep === STEPS.length - 1}*/}
			{/*				variant={'contained'}*/}
			{/*				endIcon={<NavigateNextIcon/>}*/}
			{/*				onClick={handleShowNextStep}*/}
			{/*			>*/}
			{/*				Дальше!*/}
			{/*			</Button>*/}
			{/*		)}*/}
			{/*	</Grid>*/}
			{/*</Box>*/}
		</Box>
	)
}
