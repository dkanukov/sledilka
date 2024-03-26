'use client'
import { useState } from 'react'
import { Button, StepProps, Steps, Typography } from 'antd'


export default function Roadmap() {
	const [activeStep, setActiveStep] = useState(0)
	const Step: StepProps[] = [
		{
			title: 'Развиваем фронтенд',
			subTitle: 'Красивые кнопочки?',
			description: activeStep >= 0 && 'Создание интерактивных пользовательских интерфейсов для отслеживания состояния устройств в сети. Разработка функциональности для получения видео с камер в сети. Интеграция с серверной частью приложения через API. Оптимизация для разных устройств и браузеров.',
		},
		{
			title: 'Пишем апишку и круды',
			subTitle: 'Доставим JSON из точки A в точку Б',
			description: activeStep >= 1 && 'Разработка архитектуры бэкенда, включая базу данных. Определение точек входа и структуры API для взаимодействия с фронтендом и другими клиентами. Создание серверной части приложения для отслеживания состояния устройств в сети, включая обработку запросов от клиентов. Разработка API для взаимодействия с фронтендом. Реализация базы данных для хранения информации о устройствах, видеозаписях и других данных. Реализация системы аутентификации и авторизации для защиты данных и ресурсов.',
		},
		{
			title: 'Хайпим на нейросетях',
			subTitle: 'А не поздно ли?',
			description: activeStep >= 2 && 'Сбор и аннотирование большого набора изображений с различными состояниями включенного и выключенного искусственного света. Разделение данных на наборы для обучения, валидации и тестирования. Выбор архитектуры нейросети, например, сверточной нейронной сети (CNN). Обучение нейросети или дообучение существующей нейросети на подготовленных данных с использованием выбранной архитектуры. Тест производительности и внедрение в API',
		},
		{
			title: 'Тестируем на локальных сетях',
			subTitle: 'Спасибо МИЭМУ за лабы!',
			description: activeStep >= 3 && 'Проведение функционального тестирования для проверки основных функций приложения, таких как отслеживание состояния устройств и получение видео с камер. Тестирование различных сценариев использования, включая управление устройствами и просмотр видео в локальной сети. Оценка производительности системы в локальной сети, включая скорость отклика и пропускную способность сети. Идентификация узких мест и оптимизация при необходимости.',
		},
		{
			title: 'Выходим на финишную прямую',
			subTitle: 'Собираем фидбэк и вносим правки',
			description: activeStep >= 4 && 'Дать ограниченный доступ к вашему приложению целевой аудитории, чтобы пользователи могли оценить его функциональность и производительность. Собрать обратную связь от пользователей, используя различные методы, такие как опросы, комментарии в приложении. Организовать собранную обратную связь, классифицировать ее по категориям, чтобы понять, какие аспекты приложения нуждаются в улучшениях. Оценить важность и срочность обнаруженных проблем и потребностей пользователей. Установить приоритеты для внесения изменений. На основе анализа обратной связи разработать изменения и улучшения в приложении, включая фронтенд, бэкенд и нейросеть, если применимо. Далее повторный сбор обратной связи',
		},
		{
			title: 'Открытый релиз системы',
			subTitle: 'Мы готовы! А вы?',
			description: activeStep >= 5 && 'Перед открытым релизом удостовериться, что приложение пройдет все необходимые тесты, включая функциональное, интеграционное, производительностное и безопасность. Подготовить документацию для пользователей, включая руководства, инструкции по использованию и FAQ. Фиксируем прибыль',
		},
	]

	const handleShowNextStep = () => {
		setActiveStep(activeStep + 1)
	}

	return (
		<div
			style={{
				padding: '20px',
			}}
		>
			<Steps
				current={activeStep}
				direction={'vertical'}
				items={Step}
			/>
			<Button
				disabled={activeStep >= Step.length}
				onClick={handleShowNextStep}
			>
				Дальше!
			</Button>
		</div>
	)
}

// <Button
// 	disabled={activeStep === 0}
// 	variant={'contained'}
// 	startIcon={<NavigateBeforeIcon/>}
// 	onClick={handleShowPreviousStep}
// >
// 	Я что-то не понял :(
// </Button>
// {activeStep === STEPS.length - 1 ? (
// 	<Button
// 		variant={'contained'}
// 		color={'success'}
// 		onClick={handleLastStepClick}
// 	>
// 		Вот и все!
// 	</Button>
// ) : (
// 	<Button
// 		disabled={activeStep === STEPS.length - 1}
// 		variant={'contained'}
// 		endIcon={<NavigateNextIcon/>}
// 		onClick={handleShowNextStep}
// 	>
// 		Дальше!
// 	</Button>
// )}
