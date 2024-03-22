import { Button, Input, Upload, UploadProps, message, notification } from 'antd'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { InboxOutlined } from '@ant-design/icons'

import { EntityNewLayer, EntityNewObject } from '../../api/generated/api'

import styles from './create-objects-form.module.css'

const { TextArea } = Input

interface FirstStepProps {
	whenNextStepClick: (newObject: EntityNewObject) => void
}

interface SecondStepProps {
	whenNextStepClick: (newLayerData: EntityNewLayer) => void
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

export const SecondStep = (props: SecondStepProps) => {
	const [form, setForm] = useState<EntityNewLayer>({
		floor_name: '',
		image: '',
	})

	const LoadFileConfig: UploadProps = {
		name: uuidv4(),
		action: 'http://localhost:8081/images',
		async beforeUpload(info) {
			const isCorrectFileType = info.type === 'image/png'
			if (!isCorrectFileType) {
				await message.error('Формат файла должен быть PNG')
			}

			return isCorrectFileType
		},
		/* onChange(info) {
			const { status } = info.file

			if (status === 'error') {
				notification.error({
					message: 'не удалось загрузить файл',
				})
			}

			if (status === 'done') {
				setForm({ image: info.file.name })
			}
		}, */
	}

	return (
		<div>
			<Dragger {...LoadFileConfig}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">Click or drag file to this area to upload</p>
				<p className="ant-upload-hint"> Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.</p>
			</Dragger>
			<div>
				{/* <Button
					disabled={isButtonDisabled}
					onClick={handleSendForm}
					>
					Далее
				</Button> */}
			</div>
		</div>
	)
}

