import { Button, Drawer, Input, InputNumber, Select, Typography } from 'antd'

import { BackendInternalEntityDeviceType } from '../../api/generated/api'

import styles from './device-drawer.module.css'

import { Device } from '@models'
import { DeviceKeys } from '@typos'

interface Props {
	device: Device
	whenClose: () => void
	whenChange?: (key: DeviceKeys, value: string) => void
	whenSave?: () => void
}

const { Text } = Typography
const DEVICE_TYPES = [
	{
		label: <span>компьютер</span>,
		value: BackendInternalEntityDeviceType.Computer,
	},
	{
		label: <span>камера</span>,
		value: BackendInternalEntityDeviceType.Camera,
	},
	{
		label: <span>принтер</span>,
		value: BackendInternalEntityDeviceType.Printer,
	},
]

export const DeviceDrawer = (props: Props) => {
	const isCamera = props.device.type === BackendInternalEntityDeviceType.Camera

	const handleDeviceChange = (key: DeviceKeys, value: string) => {
		if (!props.whenChange) {
			return
		}

		props.whenChange(key, value)
	}

	return (
		<Drawer
			title={`Устройство ${props.device.name}`}
			closable
			open
			onClose={props.whenClose}
			mask={false}
			placement={'bottom'}
			size={'large'}
			rootClassName={styles.drawerRoot}
		>
			<div className={styles.contentWrapper}>
				<div className={styles.content}>
					<div className={styles.inputWithLabel}>
						<Text>Название</Text>
						<Input
							value={props.device.name}
							onChange={({ target }) => handleDeviceChange('name', target.value)}
							readOnly={!props.whenChange}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>Долгота</Text>
						<InputNumber
							className={styles.inputNumber}
							value={props.device.coordinates[0]}
							onChange={(value) => handleDeviceChange('lon', String(value))}
							readOnly={!props.whenChange}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>Ширина</Text>
						<InputNumber
							className={styles.inputNumber}
							value={props.device.coordinates[1]}
							onChange={(value) => handleDeviceChange('lat', String(value))}
							readOnly={!props.whenChange}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>IP</Text>
						<Input
							value={props.device.ip}
							onChange={({ target }) => handleDeviceChange('ip', target.value)}
							readOnly={!props.whenChange}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>MAC address</Text>
						<Input
							value={props.device.macAddress}
							onChange={({ target }) => handleDeviceChange('ip', target.value)}
							readOnly={!props.whenChange}
						/>
					</div>
					{isCamera && (
						<div className={styles.inputWithLabel}>
							<Text>URL</Text>
							<Input
								value={props.device.connectionURL}
								onChange={({ target }) => handleDeviceChange('connectionURL', target.value)}
								readOnly={!props.whenChange}
							/>
						</div>
					)}
					<div className={styles.inputWithLabel}>
						<Text>Тип устройства</Text>
						<Select
							value={props.device.type}
							options={DEVICE_TYPES}
							onSelect={(value) => handleDeviceChange('type', value)}
							disabled={!props.whenChange}
						/>
					</div>
				</div>
				{props.whenSave && (
					<Button
						onClick={props.whenSave}
					>
						Сохранить
					</Button>
				)}
			</div>
		</Drawer>
	)
}
