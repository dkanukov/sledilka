import { Empty, Typography } from 'antd'

type Props = {
	message: string
}

const { Text } = Typography

export const EmptyMessage = (props: Props) => {
	return (
		<Empty
			description={
				<Text>{props.message}</Text>
			}
		/>
	)
}
