import { BackendInternalEntityDeviceType } from '../api/generated/api'

export const DeviceRuByType: Record<BackendInternalEntityDeviceType, string> = {
	'camera': 'Камера',
	'printer': 'Принтер',
	'computer': 'Компьютер',
}

export const DevicesLavelValue = [
	{
		value: BackendInternalEntityDeviceType.Camera,
		text: 'Камера',
	},
	{
		value: BackendInternalEntityDeviceType.Printer,
		text: 'Принтер',
	},
	{
		value: BackendInternalEntityDeviceType.Computer,
		text: 'Компьютер',
	},
]
