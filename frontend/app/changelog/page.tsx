'use client'
import { Typography, Input, Textarea } from '@mui/joy'
import { Box, IconButton, Paper, Button, Drawer } from '@mui/material'
import { Stack } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { format } from 'date-fns'
import { useLocalStorage } from '@/hooks/use-local-storage'
import useSWR from 'swr'

import axios from 'axios'
import { API_ROUTE } from '@/app/api/path'

interface Content {
	id?: number
    title: string
    description: string
    date: number
}

export default function Changelog() {
	const test = useSWR(`${API_ROUTE}/announcement`, async () => {
		const { data } = await axios.get(`${API_ROUTE}/announcement`)
		setContent(data.map((item: any) => {
			return {
				id: item.id,
				title: item.title,
				description: item.description,
				date: item.createdAt,
			}
		}))
	})

	const createChangelog = async (title: string, description: string) => {
		// eslint-disable-next-line compat/compat
		const response = await fetch(`${API_ROUTE}/announcement`, {
			method: 'POST',
			body: JSON.stringify({
				title,
				description,
			}),
		})
	}

	const [content, setContent] = useState<Content[]>([])
	const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('isAdmin', false)
	const [isShowForm, setIsShowForm] = useState(false)
	const [formValue, setFormValue] = useState<Content>({
		title: '',
		description: '',
		date: 0,
	})

	const handleCloseForm = () => {
		setFormValue({
			title: '',
			description: '',
			date: 0,
		})
		setIsShowForm(false)
	}

	const handleSendForm = async () => {
		await createChangelog(formValue.title, formValue.description)

		setContent([...content, {
			...formValue,
			date: Date.now(),
		}])
		handleCloseForm()
	}

	return (
		<Box>
			<Stack
				direction={'row'}
				spacing={2}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<Typography
					level="h1"
					gutterBottom
					sx={{
						textAlign: 'center',
						marginBottom: '12px',
					}}
				>
                    Обновлениея проекта
				</Typography>
				{isAdmin && (
					<IconButton
						sx={{
							marginTop: 'auto',
						}}
						onClick={() => setIsShowForm(true)}
					>
						<AddIcon/>
					</IconButton>
				)}
			</Stack>
			{content.length ? (
				content.map((item, idx) => (
					<Paper
						sx={{
							padding: '20px',
							mt: '20px',
						}}
						key={idx}
					>
						<Typography
							level={'h4'}
							gutterBottom
						>
							{item.title} {format(new Date(item.date * 1000), 'yyyy-MM-dd')}
						</Typography>
						<Typography
							level={'body-lg'}
							sx={{
								wordBreak: 'break-word',
							}}
						>
							{item.description}
						</Typography>
					</Paper>
				))
			) : (
				<Typography
					sx={{
						marginTop: '30px',
						textAlign: 'center',
					}}
					color={'primary'}
					level={'h2'}
				>
                    Тут пока ничего нет, но скоро обязательно будет
				</Typography>
			)}
			<Drawer
				anchor={'bottom'}
				open={isShowForm}
				onClose={() => setIsShowForm(false)}
			>
				<Box
					sx={{
						display: 'flex',
						padding: '20px',
						flexDirection: 'column',
						gap: '20px',
						width: 'auto',
					}}
				>
					<Input
						placeholder={'Заголовок'}
						onChange={(event) => {
							setFormValue({
								...formValue,
								title: event.target.value,
							})
						}}
					/>
					<Textarea
						placeholder={'Описание'}
						onChange={(event) => {
							setFormValue({
								...formValue,
								description: event.target.value,
							})
						}}
						minRows={3}
						maxRows={5}
					/>
					<div
						style={{
							display: 'flex',
							gap: '6px',
						}}
					>
						<Button
							onClick={handleSendForm}
						>
                            Создать
						</Button>
						<Button
							color={'error'}
							onClick={handleCloseForm}
						>
                            Отменить
						</Button>
					</div>
				</Box>
			</Drawer>
		</Box>
	)
}
