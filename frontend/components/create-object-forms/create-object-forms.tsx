import { Button, Input, Upload, UploadProps, message, UploadFile } from 'antd'
import { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { fromLonLat } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'

import { EntityNewObject } from '../../api/generated/api'

import styles from './create-objects-form.module.css'

import { Map } from '@components'

const { TextArea } = Input
const MOSCOW_COORDINATE = [37.61905400772136, 55.750549228458084]

interface FirstStepProps {
	whenNextStepClick: (newObject: EntityNewObject) => void
}

export const FirstStep = (props: FirstStepProps) => {
	const [form, setForm] = useState({
		name: '',
		address: '',
		description: '',
	})

	const isButtonDisabled = Boolean(!form.name || !form.address || !form.description)

	const handleMarkerMove = (coordinate: Coordinate) => {
		console.log(coordinate)
	}

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
			<div
				className={styles.mapWrapper}
			>
				<Map
					hideControls
					markerCoordiante={fromLonLat(MOSCOW_COORDINATE)}
					whenMarkerMove={handleMarkerMove}
				/>
			</div>
			<Button
				disabled={isButtonDisabled}
				onClick={handleSendForm}
			>
				Далее
			</Button>
		</div>
	)
}
