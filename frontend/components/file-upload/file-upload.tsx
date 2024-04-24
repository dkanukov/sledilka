import { InboxOutlined } from '@ant-design/icons'
import { Button, Upload, UploadFile, UploadProps, message } from 'antd'
import { useEffect, useState } from 'react'

import styles from './file-upload.module.css'

const { Dragger } = Upload

interface Props {
	whenFileUpload: (file: File) => void
	whenLayerCreate: () => void
}

export const FileUpload = (props: Props) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])

	const handleBeforeFileUpload: UploadProps['beforeUpload'] = (file) => {
		const isCorrectFileType = file.type === 'image/png'

		if (!isCorrectFileType) {
			message.error('Формат файла должен быть PNG')
		}

		if (isCorrectFileType) {
			setFileList([file])
			props.whenFileUpload(file)
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
					<InboxOutlined/>
				</p>
				<p className="ant-upload-text">
					Нажмите или перетащите на эту область, чтобы загрузить файл
				</p>
				<p className="ant-upload-hint">
					Выберите 1 файл в формате PNG
				</p>
			</Dragger>
			<Button
				className={styles.createButton}
				type={'primary'}
				onClick={props.whenLayerCreate}
			>
				Создать
			</Button>
		</div>
	)
}
