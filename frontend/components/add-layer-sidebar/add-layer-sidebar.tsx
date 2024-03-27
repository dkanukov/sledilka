import { InboxOutlined } from '@ant-design/icons'
import { Button, Input, message, Upload, UploadFile, UploadProps } from 'antd'
import { useState } from 'react'

import styles from './add-layer-sidebar.module.css'

import { ObjectLayer } from '@models'

interface Props {
	selectedLayer: ObjectLayer | null
	whenUploadImage: (file: File) => void
	whenFloorNameChange: (value: string) => void
	whenCreateNewLayer: () => void
}

const { Dragger } = Upload
export const AddLayerSidebar = (props: Props) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])

	const handleBeforeFileUpload: UploadProps['beforeUpload'] = (file) => {
		const isCorrectFileType = file.type === 'image/png'

		if (!isCorrectFileType) {
			message.error('Формат файла должен быть PNG')
		}

		if (isCorrectFileType) {
			setFileList([file])
			props.whenUploadImage(file)
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
		<div
			className={styles.sidebarWrapper}
		>
			<Input
				placeholder={'Название слоя'}
				size={'large'}
				value={props.selectedLayer?.floorName || ''}
				onChange={(e) => props.whenFloorNameChange(e.target.value)}
			/>
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
			</div>
			<Button
				disabled={!fileList.length || !props.selectedLayer?.floorName}
				onClick={props.whenCreateNewLayer}
			>
				Добавить
			</Button>
		</div>
	)
}