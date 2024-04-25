'use client'
import { useState } from 'react'
import { Button, Drawer, Input, message } from 'antd'

import styles from './id.module.css'

import { DeviceDrawer, EditSidebar, FileUpload, LayerDrawer, Map } from '@components'
import { useLayerEdit, useCreateNewLayer, useDrawer } from '@hooks'

export default function Id({ params } : { params: { id: string } }) {
	const [showLayerDrawer, openLayerDrawer, closeLayerDrawer] = useDrawer()
	const [mode, setMode] = useState<'edit-layer' | 'edit-devices' | 'add-layer'>('edit-devices')
	const {
		layerStore,
		handleLayerChange,
		handleAddDevice,
	} = useLayerEdit(params.id ?? '')
	const {
		layer,
		removeNewLayer,
		handleLayerNameChange,
		handleFileUpload,
		createLayer,
	} = useCreateNewLayer()

	const handleModeToggle = () => {
		if (mode === 'edit-layer') {
			setMode('edit-devices')
			return
		}

		setMode('edit-layer')
	}

	const handleCreateNewLayer = () => {
		layerStore.createNewLayer()
		openLayerDrawer()
		setMode('add-layer')
	}

	const handleCreateNewLayerDrawerClose = () => {
		removeNewLayer(),
		closeLayerDrawer()
	}

	const handleLayerCreate = async () => {
		await createLayer()
		closeLayerDrawer()
		setMode('edit-devices')
	}

	const handleDeviceClick = (id: string) => {
		layerStore.selectDevice(id)
	}

	const handleDeviceSave = async () => {
		if (!layerStore.device) {
			return
		}

		const response = await layerStore.updateDevice(layerStore.device)

		if (response) {
			await message.success({ content: 'Устройство обновлено' })
			return
		}

		await message.error({ content: 'Устройство не обновлено' })
	}

	const handleLayerUpdate = async () => {
		if (!layerStore.layer) {
			return
		}

		const response = await layerStore.handleLayerUpdate(layerStore.layer)
		if (response) {
			await message.success({ content: 'Слой обновлен' })
			return
		}

		await message.error({ content: 'Слой не был обновлен' })
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
					whenClick={handleLayerChange}
					whenCreateNewLayerClick={handleCreateNewLayer}
				/>
			)}
			{layerStore.layer && (
				<div
					className={styles.mapWrapper}
				>
					<Map
						isEdit
						isPolygonNeed={mode === 'edit-layer' || mode === 'add-layer'}
						isClickOnDeviceNeeded={mode === 'edit-devices'}
						isDevicesTranslateNeeded={mode === 'edit-devices'}
						angle={layerStore.layer.angle}
						image={layerStore.layer.image}
						devices={layerStore.layer.devices}
						coordinates={layerStore.layer.coordinates}
						whenPolygonChange={layerStore.handlePolygonChange}
						whenAddNewDevice={handleAddDevice}
						whenFeatureSelect={handleDeviceClick}
						whenDeviceTranslating={layerStore.handleSelectedDeviceTranslate}
						whenDeviceRotating={layerStore.handleDeviceRotating}
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
			{layerStore.device && (
				<DeviceDrawer
					whenSave={handleDeviceSave}
					whenChange={layerStore.handleSelectedDeviceChange}
					whenClose={() => layerStore.selectDevice(null)}
					device={layerStore.device}
				/>
			)}
			{layerStore.layer && mode === 'edit-layer' && (
				<LayerDrawer
					layer={layerStore.layer}
					whenClose={() => setMode('edit-devices')}
					whenChange={layerStore.handleLayerChange}
					whenSave={handleLayerUpdate}
					whenFileUpload={layerStore.handleFileUpload}
				/>
			)}
		</div>
	)
}
