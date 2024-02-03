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
		description: 'Создание интерактивных пользовательских интерфейсов для отслеживания состояния устройств в сети. Разработка функциональности для получения видео с камер в сети. Интеграция с серверной частью приложения через API. Оптимизация для разных устройств и браузеров.',
	},
	{
		label: 'Пишем апишку и круды',
		lead: 'Доставим JSON из точки A в точку Б',
		description: 'Разработка архитектуры бэкенда, включая базу данных. Определение точек входа и структуры API для взаимодействия с фронтендом и другими клиентами. Создание серверной части приложения для отслеживания состояния устройств в сети, включая обработку запросов от клиентов. Разработка API для взаимодействия с фронтендом. Реализация базы данных для хранения информации о устройствах, видеозаписях и других данных. Реализация системы аутентификации и авторизации для защиты данных и ресурсов.',
	},
	{
		label: 'Хайпим на нейросетях',
		lead: 'А не поздно ли?',
		description: 'Сбор и аннотирование большого набора изображений с различными состояниями включенного и выключенного искусственного света. Разделение данных на наборы для обучения, валидации и тестирования. Выбор архитектуры нейросети, например, сверточной нейронной сети (CNN). Обучение нейросети или дообучение существующей нейросети на подготовленных данных с использованием выбранной архитектуры. Тест производительности и внедрение в API',
	},
	{
		label: 'Тестируем на локальных сетях',
		lead: 'Спасибо МИЭМУ за лабы!',
		description: 'Проведение функционального тестирования для проверки основных функций приложения, таких как отслеживание состояния устройств и получение видео с камер. Тестирование различных сценариев использования, включая управление устройствами и просмотр видео в локальной сети. Оценка производительности системы в локальной сети, включая скорость отклика и пропускную способность сети. Идентификация узких мест и оптимизация при необходимости.',
	},
	{
		label: 'Выходим на финишную прямую',
		lead: 'Собираем фидбэк и вносим правки',
		description: 'Дать ограниченный доступ к вашему приложению целевой аудитории, чтобы пользователи могли оценить его функциональность и производительность. Собрать обратную связь от пользователей, используя различные методы, такие как опросы, комментарии в приложении. Организовать собранную обратную связь, классифицировать ее по категориям, чтобы понять, какие аспекты приложения нуждаются в улучшениях. Оценить важность и срочность обнаруженных проблем и потребностей пользователей. Установить приоритеты для внесения изменений. На основе анализа обратной связи разработать изменения и улучшения в приложении, включая фронтенд, бэкенд и нейросеть, если применимо. Далее повторный сбор обратной связи',
	},
	{
		label: 'Открытый релиз системы',
		lead: 'Мы готовы! А вы?',
		description: 'Перед открытым релизом удостовериться, что приложение пройдет все необходимые тесты, включая функциональное, интеграционное, производительностное и безопасность. Подготовить документацию для пользователей, включая руководства, инструкции по использованию и FAQ. Фиксируем прибыль',
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
						height: '300px',
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
