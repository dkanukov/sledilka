'use client'
import { useState } from 'react'
import { Card, Col, Flex, Image, Row, Typography } from 'antd'

import styles from './contacts.module.css'

const { Grid } = Card
const { Text, Link } = Typography

export default function Contacts() {
	return (
		<div className={styles.root}>
			<Row
				gutter={12}
			>
				<Col
					span={12}
				>
					<Card title={'Цатурян Геворг - backend разработчик'}>
						<Grid >
							<Image
								alt="Геворг"
								src={'/gevorg.jpeg'}
							/>
						</Grid>
						<Flex
							vertical
							gap={12}
							style={{
								paddingTop: '20px',
								paddingLeft: '20px',
							}}
						>
							<Text strong>Студент 4 курса ИВТ</Text>
							<Text>email: <Link href="mailto:gev.tsat@gmail.com">gev.tsat@gmail.com</Link></Text>
						</Flex>
					</Card>
				</Col>
				<Col
					span={12}
				>
					<Card title={'Кануков Денис - frontend разработчик'}>
						<Grid>
							<Image
								alt="Денис"
								src={'/denis.jpeg'}
							/>
						</Grid>
						<Flex
							vertical
							gap={12}
							style={{
								paddingTop: '20px',
								paddingLeft: '20px',
							}}
						>
							<Text strong>Студент 4 курса ИВТ</Text>
							<Text>email: <Link href="mailto:gev.tsat@gmail.com">gev.tsat@gmail.com</Link></Text>
						</Flex>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Card title={'Трубочкина Надежда Константиновна - руководитель'}>
						<Image
							alt="Надежда"
							src={'/nadejda.jpeg'}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

// <iframe
// 					src="https://yandex.ru/map-widget/v1/?um=constructor%3A74af39facb337d144cfd686260e59d621e1450d8335b89c25ed0a17cd536d2cd&amp;source=constructor" width={'100%'}
// 					height="452" frameBorder="0"
// 				>
// 				</iframe>
