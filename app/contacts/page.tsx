import React from 'react'
import { AspectRatio, Card } from '@mui/joy'

import styles from './contacts.module.css'

export default function Contacts() {
	return (
		<div>
			<div className={styles.cards}>
				<Card
					orientation="horizontal"
				>
					<AspectRatio
						sx={{ minWidth: 200 }}
						flex
						ratio="1"
					>
						<img
							src="/gevorg.jpeg"
							alt=""
						/>
					</AspectRatio>
				</Card>
			</div>
		</div>
	)
}
