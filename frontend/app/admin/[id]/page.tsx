'use client'
import { useState } from 'react'

import styles from './id.module.css'

import { EditSidebar, Map } from '@components'
import { useLayerEdit, useCreateNewLayer } from '@hooks'

const enum Mode {
	ADD_LAYER = 'ADD_LAYER',
	ADD_CAMERA = 'ADD_CAMERA',
	CAMERA_INFO = 'CAMERA_INFO',
	EDIT_LAYER = 'EDIT_LAYER',
}

export default function Id({ params } : { params: { id: string } }) {
	const [mode, setMode] = useState<Mode | null>(Mode.EDIT_LAYER)
	const {
		layerStore,
		handleLayerSave,
	} = useLayerEdit(params.id ?? '')
	const {
		createNewLayer,
	} = useCreateNewLayer()

	const handleNewLayerCreateClick = () => {
		//меняем мод, чтобы перерендерить полигон в Map
		setMode(null)
		createNewLayer()
		setMode(Mode.ADD_LAYER)
	}

	return (
		<div
			className={styles.root}
		>
			{layerStore.object && (
				<EditSidebar
					object={layerStore.object}
					selectedItem={layerStore.layer?.id ?? ''}
					whenClick={layerStore.handleSelectedLayerChange}
					whenCreateNewLayerClick={handleNewLayerCreateClick}
				/>
			)}
			{layerStore.layer && (
				<Map
					isPolygonNeed={mode === Mode.ADD_LAYER || mode === Mode.EDIT_LAYER}
					angle={layerStore.layer.angle}
					image={layerStore.layer.image}
					coordinates={layerStore.layer.coordinates}
					whenLayerSave={handleLayerSave}
					whenPolygonChange={layerStore.handlePolygonChange}
				/>
			)}
		</div>
	)
}
