import { EntityDeviceType } from '../api/generated/api'

export const DeviceRuByType: Record<EntityDeviceType, string> = {
	'camera': 'Камера',
	'printer': 'Принтер',
	'computer': 'Компьютер',
}

export const DevicesLavelValue = [
	{
		value: EntityDeviceType.Camera,
		text: 'Камера',
	},
	{
		value: EntityDeviceType.Printer,
		text: 'Принтер',
	},
	{
		value: EntityDeviceType.Computer,
		text: 'Компьютер',
	},
]
