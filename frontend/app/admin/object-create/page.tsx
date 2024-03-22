'use client'

import { Steps, StepProps, Button, Typography } from 'antd'
import { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

import { EntityNewLayer, EntityNewObject } from '../../../api/generated/api'

import styles from './object-create.module.css'

import { CreateObjectForms } from '@components'
import { useObjectCreateStore } from '@store'

const { Text } = Typography
export default function ObjectCreate() {
	const objectCreateStore = useObjectCreateStore()
	const [currentStep, setCurrentStep] = useState(0)
	const [isFetching, setIsFetching] = useState(false)

	const STEP_ITEMS: StepProps[] = [
		{
			title: 'Информация об объекте',
			disabled: currentStep !== 0,
			icon: isFetching && <LoadingOutlined/>,
		},
		{
			title: 'Добавление слоев',
			disabled: currentStep !== 1,
			icon: isFetching && <LoadingOutlined/>,
		},
	]

	const nextStep = () => setCurrentStep(currentStep + 1)

	const previousStep = () => setCurrentStep(currentStep - 1)

	const handleCreateNewObject = async (newObject: EntityNewObject) => {
		setIsFetching(true)
		await objectCreateStore.createNewObject(newObject)
		nextStep()
		setIsFetching(false)
	}

	const handleCreateNewLayer = async (newLayer: EntityNewLayer) => {
		if (!objectCreateStore.createdObject) {
			return
		}

		setIsFetching(true)
		await objectCreateStore.createNewLayer(objectCreateStore.createdObject.id, newLayer)
		setIsFetching(false)
	}

	const renderStepContent = () => {
		if (currentStep === 0) {
			return (
				<CreateObjectForms.FirstStep
					whenNextStepClick={handleCreateNewObject}
				/>
			)
		}

		if (currentStep === 1) {
			return (
				<CreateObjectForms.SecondStep
					whenNextStepClick={handleCreateNewLayer}
				/>
			)
		}
	}

	return (
		<div
			className={styles.container}
		>
			<Steps
				current={currentStep}
				items={STEP_ITEMS}
			/>
			<div className={styles.content}>
				{renderStepContent()}
			</div>
		</div>
	)
}
