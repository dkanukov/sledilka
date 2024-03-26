import { Button, Input, Upload, UploadProps, message, UploadFile } from 'antd'
import { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import * as L from 'leaflet'

import { EntityNewObject } from '../../api/generated/api'

import styles from './create-objects-form.module.css'

import { Map } from '@components'
import { ObjectLayer } from '@models'

const { TextArea } = Input

interface FirstStepProps {
	whenNextStepClick: (newObject: EntityNewObject) => void
}

const { Dragger } = Upload

export const FirstStep = (props: FirstStepProps) => {
	const [form, setForm] = useState<Required<EntityNewObject>>({
		name: '',
		address: '',
		description: '',
	})

	const isButtonDisabled = Boolean(!form.name || !form.address || !form.description)

	const handleSendForm = () => {
		props.whenNextStepClick(form)
	}

	return (
		<div className={styles.form}>
			<Input
				placeholder={'Название объекта'}
				value={form.name}
				onChange={(e) => setForm({
					...form,
					name: e.target.value,
				})}
			/>
			<TextArea
				placeholder={'Описание'}
				value={form.description}
				onChange={(e) => setForm({
					...form,
					description: e.target.value,
				})}
			/>
			<Input
				placeholder={'Адрес'}
				value={form.address}
				onChange={(e) => setForm({
					...form,
					address: e.target.value,
				})}
			/>
			<div>
				<Button
					disabled={isButtonDisabled}
					onClick={handleSendForm}
				>
					Далее
				</Button>
			</div>
		</div>
	)
}

interface SecondStepProps {
	whenNextStepClick: (file: File) => Promise<void>
}
export const SecondStep = (props: SecondStepProps) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])

	const handleUploadImage = async () => {
		//NOTE: проблема с типизацией файл формата
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const response = await props.whenNextStepClick(fileList[0])
	}

	const handleBeforeFileUpload: UploadProps['beforeUpload'] = (file) => {
		const isCorrectFileType = file.type === 'image/png'

		if (!isCorrectFileType) {
			message.error('Формат файла должен быть PNG')
		}

		if (isCorrectFileType) {
			setFileList([file])
		}
	}

	const handleFileRemove = () => {
		setFileList([])
	}

	const LoadFileConfig: UploadProps = {
		onRemove: handleFileRemove,
		beforeUpload: handleBeforeFileUpload,
	}

	return (
		<div>
			<Dragger
				{...LoadFileConfig}
				fileList={fileList}
				maxCount={1}
			>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">
					Нажмите или перетащите на эту область, чтобы загрузить файл
				</p>
				<p className="ant-upload-hint">
					Выберите 1 файл в формате PNG
				</p>
			</Dragger>
			<div className={styles.bottomControls}>
				<Button
					disabled={!fileList.length}
					onClick={handleUploadImage}
				>
					Далее
				</Button>
			</div>
		</div>
	)
}

interface ThirdStepProps {
	selectedLayer: ObjectLayer
	handleLayerDrag: (lan:[number, number], lot: [number, number]) => void
	whenNextStepClick: () => Promise<void>
}

export const ThirdStep = (props: ThirdStepProps) => {
	const handleLayerDrag = (e: L.LatLng | L.LatLng[]) => {
		// @ts-expect-error
		const lan = [e['_southWest'].lat, e['_southWest'].lng] as [number, number]
		// @ts-expect-error
		const lot = [e['_northEast'].lat, e['_northEast'].lng]as [number, number]

		props.handleLayerDrag(lan, lot)
	}

	return (
		<div className={styles.map}>
			<Map
				edit
				selectedLayer={props.selectedLayer}
				handleLayerDrag={handleLayerDrag}
			/>
			<div className={styles.bottomControls}>
				<Button
					onClick={props.whenNextStepClick}
				>
					Далее
				</Button>
			</div>
		</div>
	)
}
