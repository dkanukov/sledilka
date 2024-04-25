'use client'

import { Steps, StepProps, Button, Typography } from 'antd'
import { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

import { EntityNewLayer, EntityNewObject } from '../../../api/generated/api'

import styles from './object-create.module.css'

import { CreateObjectForms } from '@components'
import { useObjectCreateStore } from '@store'

export default function ObjectCreate() {
	const objectCreateStore = useObjectCreateStore()
	const router = useRouter()
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
		{
			title: 'Редактирование схемы',
			disabled: currentStep !== 2,
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

	const handleUploadImage = async (file: File) => {
		setIsFetching(true)
		await objectCreateStore.uploadImage(file)
		nextStep()
		setIsFetching(false)
	}

	const handleLayerDrag = (southWest:[number, number], northEast: [number, number]) => {
		objectCreateStore.whenLayerLanLotChange(southWest, northEast)
	}

	const handleCreateNewLayer = async (name: string) => {
		if (!objectCreateStore.createdObject) {
			return
		}

		setIsFetching(true)
		const response = await objectCreateStore.createNewLayer(objectCreateStore.createdObject.id, objectCreateStore.createdObject.layers[0], name)
		setIsFetching(false)
		if (response.success) {
			router.push(`/admin?layerId=${response.id}`)
		}
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
					whenNextStepClick={handleUploadImage}
				/>
			)
		}

		if (currentStep === 2 && objectCreateStore.createdObject?.layers[0]) {
			return (
				<CreateObjectForms.ThirdStep
					selectedLayer={objectCreateStore.createdObject.layers[0]}
					handleLayerDrag={handleLayerDrag}
					whenNextStepClick={handleCreateNewLayer}
				/>
			)
		}
	}

	return (
		<div className={styles.root}>
			<Steps
				current={currentStep}
				items={STEP_ITEMS}
			/>
			{renderStepContent()}
		</div>
	)
}
