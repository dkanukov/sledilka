'use client'
import { useState } from 'react'
import { Button, Drawer, Input } from 'antd'

import styles from './id.module.css'

import { DeviceDrawer, EditSidebar, FileUpload, LayerDrawer, Map } from '@components'
import { useObjectEdit, useDrawer, useCreateNewLayer } from '@hooks'
import { Area } from '@typos'

export default function Id({ params } : { params: { id: string } }) {
	const [showLayerDrawer, openLayerDrawer, closeLayerDrawer] = useDrawer()
	const [mode, setMode] = useState<'edit-layer' | 'edit-devices' | 'add-layer'>('edit-devices')
	const {
		object,
		layer,
		device,
		handleLayerSelect,
		handleLayerTranslate,
		handleLayerUpdate,
		handleDeviceSelect,
		handleDeviceChange,
		handleDeviceTranslate,
		handleAddNewDevice,
		handleDeviceSave,
		handleFileUpload: handleFileUploadExistingLayer,
		flushDevice,
		addLayer,
	} = useObjectEdit(params.id)

	const {
		newLayer,
		initNewLayer,
		flushNewLayer,
		handleSaveNewLayer,
		handleLayerNameChange,
		handleFileUpload,
		handleLayerTranslate: handleNewLayerTranslate,
	} = useCreateNewLayer()

	const selectedLayer = mode === 'add-layer' && newLayer ? newLayer : layer

	const handleSelectedLayerTranslate = (coordinates: Area, angle: number) => {
		if (mode === 'add-layer') {
			handleNewLayerTranslate(coordinates, angle)
			return
		}

		handleLayerTranslate(coordinates, angle)
	}

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
		const layer = await handleSaveNewLayer()
		if (layer) {
			addLayer(layer)
			closeLayerDrawer()
			setMode('edit-devices')
		}
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
			{selectedLayer && (
				<div
					className={styles.mapWrapper}
				>
					<Map
						isEdit
						isPolygonNeed={mode === 'edit-layer' || mode === 'add-layer'}
						isClickOnDeviceNeeded={mode === 'edit-devices'}
						isDevicesTranslateNeeded={mode === 'edit-devices'}
						angle={selectedLayer.angle}
						image={selectedLayer.image}
						devices={selectedLayer.devices}
						coordinates={selectedLayer.coordinates}
						whenPolygonChange={handleSelectedLayerTranslate}
						whenAddNewDevice={handleAddNewDevice}
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
					whenFileUpload={handleFileUploadExistingLayer}
				/>
			)}
		</div>
	)
}
