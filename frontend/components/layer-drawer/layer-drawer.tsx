import { Button, Drawer, Input, InputNumber, Typography, Upload, UploadFile, UploadProps, message } from 'antd'

import styles from './layer-drawer.module.css'

import { ObjectLayer } from '@models'
import { LayerKeys } from '@typos'
import { useState } from 'react'
import { BASE_URL } from '../../api/generated/base-url'

interface Props {
	layer: ObjectLayer
	whenSave: () => void
	whenClose: () => void
	whenChange: (key: LayerKeys, value: string) => void
	whenFileUpload: (file: File) => void
}

const { Text } = Typography

export const LayerDrawer = (props: Props) => {
	const handleBeforeFileUpload: UploadProps['beforeUpload'] = (file) => {
		const isCorrectFileType = file.type === 'image/png'

		if (!isCorrectFileType) {
			message.error('Формат файла должен быть PNG')
		}

		if (isCorrectFileType) {
			props.whenFileUpload(file)
		}
	}
	return (
		<Drawer
			title={props.layer.floorName}
			closable
			open
			onClose={props.whenClose}
			mask={false}
			placement={'bottom'}
			rootClassName={styles.drawerRoot}
		>
			<div className={styles.content}>
				<div className={styles.inputWithLabel}>
					<Text>Название</Text>
					<Input
						value={props.layer.floorName}
						onChange={({ target }) => props.whenChange('floorName', target.value)}
					/>
				</div>
				{/* <div className={styles.inputWithLabel}>
					<Text>Угол поворота</Text>
					<InputNumber
						className={styles.inputNumber}
						value={props.layer.angle}
						onChange={(value) => props.whenChange('angle', String(value))}
					/>
				</div> */}
				<Upload
					beforeUpload={handleBeforeFileUpload}
					listType="picture"
					maxCount={1}
					fileList={[{
						name: `${props.layer.image}`,
						uid: '-1',
						url: `${BASE_URL}/images/${props.layer.image}`,
					}]}
				>
					<Button>Изменить схему</Button>
				</Upload>
				<Button
					onClick={props.whenSave}
				>
					Сохранить
				</Button>
			</div>
		</Drawer>
	)
}
