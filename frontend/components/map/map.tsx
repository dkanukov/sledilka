/* eslint-disable @typescript-eslint/no-floating-promises */
'use client'
import { useEffect, useRef, useState } from 'react'
import { map, Map as IMap, tileLayer, imageOverlay } from 'leaflet'

import styles from './map.module.css'

import 'leaflet/dist/leaflet.css'
import '@maptiler/leaflet-maptilersdk'
import { ObjectStorage } from '@models'

import CustomedApi from '../../api/generated/customed-api'

interface Props {
	objectStorage: ObjectStorage
}

export const Map = (props: Props) => {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapRef, setMapRef] = useState<IMap>()

	useEffect(() => {
		if (mapContainerRef.current) {
			const mapInstance = map(mapContainerRef.current).setView([props.objectStorage.layers[0].coordinateX, props.objectStorage.layers[0].coordinateY], 13)
			tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wL6YzJn6rYPYSi4sb7R3', {
			}).addTo(mapInstance)

			// убираем кнопки зума
			mapInstance.removeControl(mapInstance.zoomControl)

			setMapRef(mapInstance)
		}
	}, [])

	useEffect(() => {
		if (!mapRef) {
			return
		}

		mapRef.setView([props.objectStorage.layers[0].coordinateX, props.objectStorage.layers[0].coordinateY], 13)
		loadImage(props.objectStorage.layers[0].image ?? '')
	}, [props.objectStorage])

	const loadImage = async (imageUrl: string) => {
		//TODO: add image on map
		// const { data } = await CustomedApi.images.imagesDetail(imageUrl)objectURL = URL.createObjectURL(object)
		// imageOverlay(data)
	}

	return (
		<div
			ref={mapContainerRef}
			className={styles.map}
		/>
	)
}
