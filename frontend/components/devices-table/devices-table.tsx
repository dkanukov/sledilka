import { Input, Table, TableProps, Tag } from 'antd'
import Link from 'next/link'
import { VideoCameraOutlined } from '@ant-design/icons'

import { EntityDeviceType } from '../../api/generated/api'

import styles from './devices-table.module.css'

import { Device } from '@models'
import { DeviceRuByType, DevicesLavelValue } from '@constants'

type Props = {
	devices: Device[]
}

export const DevicesTable = (props: Props) => {
	const columns: TableProps<Device>['columns'] = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
			render: (name, device) => (
				<div>
					{name}
					{device.type === EntityDeviceType.Camera && (
						<Link
							href={`/admin/devices/camera?cameraId=${device.id}`}
						>
							<VideoCameraOutlined />
						</Link>
					)}
				</div>
			),
			filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
				<div className={styles.dropdown}>
					<Input
						allowClear
						placeholder={'Поиск'}
						value={selectedKeys[0]}
						onChange={({ target }) => setSelectedKeys(target.value ? [target.value] : [])}
						onPressEnter={() => confirm({ closeDropdown: false })}
					/>
				</div>
			),
			onFilter: (value, device) => {
				return device.name.toLowerCase().includes((value as string).toLowerCase())
			},
		},
		{
			title: 'Активно',
			dataIndex: 'isActive',
			key: 'isActive',
			render: (value: boolean) => value ? (<Tag color={'success'}>Включено</Tag>) : (<Tag color={'error'}>Отключено</Tag>),
			filterMultiple: false,
			filters: [
				{
					text: 'Включено',
					value: true,
				},
				{
					text: 'Отключено',
					value: false,
				},
			],
			onFilter: (isActive, device) => {
				return isActive === device.isActive
			},
		},
		{
			title: 'Объект',
			dataIndex: 'objectName',
			key: 'objectName',
		},
		{
			title: 'Слой',
			dataIndex: 'layerName',
			key: 'layerName',
		},
		{
			title: 'IP',
			dataIndex: 'ip',
			key: 'ip',
		},
		{
			title: 'MAC',
			dataIndex: 'macAddress',
			key: 'macAddress',
		},
		{
			title: 'Тип',
			dataIndex: 'type',
			key: 'type',
			render: (type: EntityDeviceType) => {
				return DeviceRuByType[type]
			},
			filters: DevicesLavelValue,
			onFilter: (type, device) => type === device.type,
		},
	]

	return (
		<Table
			pagination={false}
			scroll={{
				y: self.innerHeight - 280,
			}}
			columns={columns}
			dataSource={props.devices}
		/>
	)
}
