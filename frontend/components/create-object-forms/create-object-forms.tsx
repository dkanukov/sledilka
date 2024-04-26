import { Button, Input, AutoComplete, Empty } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { fromLonLat } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { debounce } from 'lodash'

import { EntityNewObject } from '../../api/generated/api'

import styles from './create-objects-form.module.css'

import { Location } from '@models'
import { Map } from '@components'
import { geosearchService } from '@api'

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
	const [locations, setLocationts] = useState<Location[]>([])
	const [markerCoordiante, setMarkerCoordinate] = useState(fromLonLat(MOSCOW_COORDINATE))

	const debouncedGeosearchRequest = useCallback(
		debounce(async (value: string) => {
			const locations = await geosearchService.search(value)
			setLocationts(locations)
		}, 500),
		[],
	)

	const isButtonDisabled = Boolean(!form.name || !form.address || !form.description)

	const handleMarkerMove = (coordinate: Coordinate) => {
		setMarkerCoordinate(coordinate)
	}

	const handleAddressSelect = (id: string) => {
		const selectedLocation = locations.find((loc) => loc.id === id)

		if (!selectedLocation) {
			return
		}

		setMarkerCoordinate(fromLonLat(selectedLocation.coordinates))
		setForm({
			...form,
			address: selectedLocation.address,
		})
	}

	const handleAddressChange = (value: string) => {
		setForm({
			...form,
			address: value,
		})

		if (!value) {
			return
		}
		debouncedGeosearchRequest(value)
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
			{/* <Input
				placeholder={'Адрес'}
				value={form.address}
				onChange={(e) => handleAddressChange(e.target.value)}
			/> */}
			<AutoComplete
				placeholder={'Адрес'}
				value={form.address}
				onChange={(value: string) => handleAddressChange(value)}
				onSelect={(id) => handleAddressSelect(id)}
			>
				{locations.length > 0 ? (
					locations.map((loc) => (
						<AutoComplete.Option
							key={loc.id}
							value={loc.id}
						>
							{`${loc.address}-${loc.description}`}
						</AutoComplete.Option>
					))
				) : (
					<AutoComplete.Option
						value={null}
					>
						<Empty/>
					</AutoComplete.Option>
				)}
			</AutoComplete>
			<div
				className={styles.mapWrapper}
			>
				<Map
					hideControls
					center={markerCoordiante}
					markerCoordiante={markerCoordiante}
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
