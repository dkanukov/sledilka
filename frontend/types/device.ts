import { Device } from '@models'

export type DeviceKeys = keyof Device | 'lon' | 'lat'

export interface DeviceFilter {
	objectId?: string
	layerId?: string
}
export type DeviceFilterKeys = keyof DeviceFilter
export interface DeviceExtendedInfo extends Device {
	layerName: string
	objectName: string
	objectId: string
}
