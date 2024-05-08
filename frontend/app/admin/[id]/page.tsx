'use client'
import { useState } from 'react'
import { Button, Drawer, Input, message } from 'antd'

import styles from './id.module.css'

import { DeviceDrawer, EditSidebar, FileUpload, LayerDrawer, Map } from '@components'
import { useObjectEdit, useDrawer, useCreateNewLayer } from '@hooks'

export default function Id({ params } : { params: { id: string } }) {
	const [showLayerDrawer, openLayerDrawer, closeLayerDrawer] = useDrawer()
	const [mode, setMode] = useState<'edit-layer' | 'edit-devices' | 'add-layer'>('edit-devices')
	const {
		object,
		layer,
		device,
		handleLayerSelect,
		handleLayerTranslate,
		handleDeviceSelect,
		handleDeviceChange,
		handleDeviceTranslate,
		flushDevice,
	} = useObjectEdit(params.id)

	const {
		newLayer,
		initNewLayer,
		flushNewLayer,
		handleSaveNewLayer,
		handleLayerNameChange,
		handleFileUpload,
	} = useCreateNewLayer()

	const handleModeToggle = () => {
		if (mode === 'edit-layer') {
			setMode('edit-devices')
			return
		}

		setMode('edit-layer')
	}

	const handleCreateNewLayer = () => {
		initNewLayer(params.id)
		openLayerDrawer()
		setMode('add-layer')
	}

	const handleCreateNewLayerDrawerClose = () => {
		flushNewLayer()
		closeLayerDrawer()
	}

	const handleLayerCreate = async () => {
		await handleSaveNewLayer()
		closeLayerDrawer()
		setMode('edit-devices')
	}

	const renderAddLayerDrawer = () => (
		<Drawer
			closable
			title={'Добавление слоя'}
			open={showLayerDrawer}
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
					value={newLayer?.floorName}
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
			{object && (
				<EditSidebar
					layers={object.layers}
					selectedItem={layer?.id || ''}
					whenClick={handleLayerSelect}
					whenCreateNewLayerClick={handleCreateNewLayer}
				/>
			)}
			{layer && (
				<div
					className={styles.mapWrapper}
				>
					<Map
						isEdit
						isPolygonNeed={mode === 'edit-layer' || mode === 'add-layer'}
						isClickOnDeviceNeeded={mode === 'edit-devices'}
						isDevicesTranslateNeeded={mode === 'edit-devices'}
						angle={layer.angle}
						image={layer.image}
						devices={layer.devices}
						coordinates={layer.coordinates}
						whenPolygonChange={handleLayerTranslate}
						whenAddNewDevice={handleAddDevice}
						whenFeatureSelect={handleDeviceSelect}
						whenDeviceTranslating={handleDeviceTranslate}
						//TODO: поворот не работает
						// whenDeviceRotating={layerStore.handleDeviceRotating}
					/>
					<div className={styles.editModeController}>
						<Button
							type={'primary'}
							onClick={handleModeToggle}
						>
							Редактирование: {mode === 'edit-layer' ? 'Слоя' : 'Устройств'}
						</Button>
					</div>
				</div>
			)}
			{renderAddLayerDrawer()}
			{device && (
				<DeviceDrawer
					whenSave={handleDeviceSave}
					whenChange={handleDeviceChange}
					whenClose={flushDevice}
					device={device}
				/>
			)}
			{layer && mode === 'edit-layer' && (
				<LayerDrawer
					layer={layer}
					whenClose={() => setMode('edit-devices')}
					whenChange={handleLayerSelect}
					whenSave={handleLayerUpdate}
					whenFileUpload={layerStore.handleFileUpload}
				/>
			)}
		</div>
	)
}
