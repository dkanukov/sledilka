import { Menu } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import styles from './edit-sidebar.module.css'

import { ObjectLayer } from '@models'
import { getMenuItem } from '@helpers'

interface Props {
	layers: ObjectLayer[]
	selectedItem: string
	whenClick: (item: string) => void
	whenCreateNewLayerClick: () => void
}

export const EditSidebar = (props: Props) => {
	const menuItems = [
		...props.layers.map((layer) => (
			getMenuItem({
				key: layer.id,
				label: layer.floorName,
			}))),
		getMenuItem({
			key: 'create-new-layer',
			label: 'Добавить слой',
			icon: <PlusOutlined/>,
		}),
	]

	const handleClick = (key: string) => {
		if (key === 'create-new-layer') {
			props.whenCreateNewLayerClick()
			return
		}

		props.whenClick(key)
	}

	return (
		<Menu
			className={styles.menu}
			mode={'inline'}
			selectedKeys={[props.selectedItem]}
			items={menuItems}
			onSelect={({ key }) => handleClick(key)}
		/>
	)
}

