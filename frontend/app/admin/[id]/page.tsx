'use client'
import { useState } from 'react'
import { Drawer, Input } from 'antd'

import styles from './id.module.css'

import { EditSidebar, FileUpload, Map } from '@components'
import { useLayerEdit, useCreateNewLayer, useDrawer } from '@hooks'

const enum Mode {
	ADD_LAYER = 'ADD_LAYER',
	ADD_CAMERA = 'ADD_CAMERA',
	CAMERA_INFO = 'CAMERA_INFO',
	EDIT_LAYER = 'EDIT_LAYER',
}

export default function Id({ params } : { params: { id: string } }) {
	const [mode, setMode] = useState<Mode>(Mode.EDIT_LAYER)
	const { show, open, close } = useDrawer()
	const {
		layerStore,
		handleLayerSave,
	} = useLayerEdit(params.id ?? '')
	const {
		layer,
		createNewLayer,
		removeNewLayer,
		handleLayerNameChange,
		handleFileUpload,
		createLayer,
	} = useCreateNewLayer()

	const handleCreateNewLayer = () => {
		createNewLayer()
		setMode(Mode.ADD_LAYER)
		open()
	}

	const handleCreateNewLayerDrawerClose = () => {
		removeNewLayer(),
		close()
	}

	const handleLayerCreate = async () => {
		await createLayer()
		close()
	}

	const renderAddLayerDrawer = () => (
		<Drawer
			closable
			title={'Добавление слоя'}
			open={show}
			onClose={handleCreateNewLayerDrawerClose}
			mask={false}
			placement={'bottom'}
			rootClassName={styles.drawerRoot}
		>
			<div
				className={styles.drawerContent}
			>
				<Input
					placeholder={'Названте слоя'}
					value={layer?.floorName}
					onChange={(e) => handleLayerNameChange(e.target.value)}
				/>
				<FileUpload
					whenFileUpload={handleFileUpload}
					whenLayerCreate={handleLayerCreate}
				/>
			</div>
		</Drawer>
	)

	return (
		<div
			className={styles.root}
		>
			{layerStore.object && (
				<EditSidebar
					object={layerStore.object}
					selectedItem={layerStore.layer?.id ?? ''}
					whenClick={layerStore.handleSelectedLayerChange}
					whenCreateNewLayerClick={handleCreateNewLayer}
				/>
			)}
			{layerStore.layer && (
				<Map
					isPolygonNeed
					angle={layerStore.layer.angle}
					image={layerStore.layer.image}
					coordinates={layerStore.layer.coordinates}
					whenLayerSave={handleLayerSave}
					whenPolygonChange={layerStore.handlePolygonChange}
				/>
			)}
			{renderAddLayerDrawer()}
		</div>
	)
}
