'use client'

import { Steps, StepProps } from 'antd'
import { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

import styles from './object-create.module.css'

export default function ObjectCreate() {
	const [currentStep, setCurrentStep] = useState(0)
	const [isFetching, setIsFetching] = useState(false)

	const STEP_ITEMS: StepProps[] = [
		{
			title: 'Информация об объекте',
			disabled: currentStep !== 0,
			icon: isFetching && <LoadingOutlined/>,
		},
	]

	// const nextStep = () => setCurrentStep(currentStep + 1)
	//
	// const previousStep = () => setCurrentStep(currentStep - 1)
	//
	// const handleCreateNewObject = async (newObject: ObjectStorage) => {
	// 	setIsFetching(true)
	// 	await objectCreateStore.createNewObject(newObject)
	// 	nextStep()
	// 	setIsFetching(false)
	// }
	//
	// const renderStepContent = () => {
	// 	if (currentStep === 0) {
	// 		return (
	// 			<CreateObjectForms.FirstStep
	// 				whenNextStepClick={handleCreateNewObject}
	// 			/>
	// 		)
	// 	}
	// }

	return (
		<div className={styles.root}>
			<Steps
				current={currentStep}
				items={STEP_ITEMS}
			/>
			{/*{renderStepContent()}*/}
		</div>
	)
}
