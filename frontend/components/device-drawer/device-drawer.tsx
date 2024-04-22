import { Button, Drawer, Input, InputNumber, Select, Typography } from 'antd'

import { EntityDeviceType } from '../../api/generated/api'

import styles from './device-drawer.module.css'

import { Device } from '@models'
import { DeviceKeys } from '@typos'

interface Props {
	device: Device
	whenClose: () => void
	whenChange: (key: DeviceKeys, value: string) => void
	whenSave: () => void
}

const { Text } = Typography
const DEVICE_TYPES = [
	{
		label: <span>компьютер</span>,
		value: EntityDeviceType.Computer,
	},
	{
		label: <span>камера</span>,
		value: EntityDeviceType.Camera,
	},
	{
		label: <span>принтер</span>,
		value: EntityDeviceType.Printer,
	},
]

export const DeviceDrawer = (props: Props) => {
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
							placeholder={'IP'}
							value={props.device.name}
							onChange={({ target }) => props.whenChange('name', target.value)}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>Долгота</Text>
						<InputNumber
							className={styles.inputNumber}
							value={props.device.coordinates[0]}
							onChange={(value) => props.whenChange('lon', String(value))}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>Ширина</Text>
						<InputNumber
							className={styles.inputNumber}
							value={props.device.coordinates[1]}
							onChange={(value) => props.whenChange('lat', String(value))}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>IP</Text>
						<Input
							value={props.device.ip}
							onChange={({ target }) => props.whenChange('ip', target.value)}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>MAC address</Text>
						<Input
							value={props.device.macAddress}
							onChange={({ target }) => props.whenChange('ip', target.value)}
						/>
					</div>
					<div className={styles.inputWithLabel}>
						<Text>Тип устройства</Text>
						<Select
							value={props.device.type}
							options={DEVICE_TYPES}
							onSelect={(value) => props.whenChange('type', value)}
						/>
					</div>
				</div>
				<Button
					onClick={props.whenSave}
				>
					Сохранить
				</Button>
			</div>
		</Drawer>
	)
}