// createTaskDialog.tsx
'use client'

import { RefObject, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'
import { ITask, IDetailedTask, TaskStatus, Priority } from '@/interfaces'

interface User {
	id: number
	name: string
	surname: string
	middleName: string
}

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
}

interface FormData {
	title: string
	assignedTo: User | null
	dueDate: string
	priority: Priority
	status: TaskStatus
	description: string
}

export default function CreateTaskDialog({ dialogRef }: Props) {
	const [users, setUsers] = useState<User[]>([])
	const [isUsersLoading, setIsUsersLoading] = useState(false)
	const [showUserDropdown, setShowUserDropdown] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<FormData>({
		defaultValues: {
			title: '',
			assignedTo: null,
			dueDate: '',
			priority: Priority.MEDIUM,
			status: TaskStatus.ACTIVE,
			description: '',
		},
	})

	// Загрузка списка пользователей
	useEffect(() => {
		const fetchUsers = async () => {
			setIsUsersLoading(true)
			try {
				// Заглушка для запроса пользователей
				await new Promise(resolve => setTimeout(resolve, 500))

				// Статичные тестовые данные
				const mockUsers: User[] = [
					{ id: 1, name: 'Иван', surname: 'Иванов', middleName: 'Иванович' },
					{ id: 2, name: 'Петр', surname: 'Петров', middleName: 'Петрович' },
					{
						id: 3,
						name: 'Сергей',
						surname: 'Сергеев',
						middleName: 'Сергеевич',
					},
					{
						id: 4,
						name: 'Алексей',
						surname: 'Алексеев',
						middleName: 'Алексеевич',
					},
				]

				setUsers(mockUsers)
			} catch (error) {
				console.error('Ошибка при загрузке пользователей:', error)
			} finally {
				setIsUsersLoading(false)
			}
		}

		fetchUsers()
	}, [])

	const onSubmit = (data: FormData) => {
		console.log('Создание задачи:', data)
		dialogRef.current?.close()
	}

	const handleContentChange = (content: string) => {
		setValue('description', content)
	}

	const handleClose = () => {
		dialogRef.current?.close()
	}

	const handleUserSelect = (user: User) => {
		setValue('assignedTo', user)
		setShowUserDropdown(false)
		setSearchTerm('')
	}

	const filteredUsers = users.filter(user => {
		const fullName =
			`${user.surname} ${user.name} ${user.middleName}`.toLowerCase()
		return fullName.includes(searchTerm.toLowerCase())
	})

	const assignedTo = watch('assignedTo')

	return (
		<div className='flex flex-col h-full'>
			{/* Шапка диалога */}
			<div className='sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center'>
				<h2 className='text-xl font-bold text-gray-800'>
					Создание новой задачи
				</h2>
				<button
					onClick={handleClose}
					className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
					aria-label='Закрыть'
				>
					×
				</button>
			</div>

			{/* Форма создания */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col flex-grow p-6 overflow-y-auto'
			>
				<div className='space-y-6 flex-grow'>
					{/* Название задачи */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Название задачи *
						</label>
						<input
							{...register('title', { required: true })}
							className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
							placeholder='Введите название задачи'
						/>
						{errors.title && (
							<p className='text-red-500 text-sm mt-1'>Это поле обязательно</p>
						)}
					</div>

					{/* Ответственный */}
					<div className='relative'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Ответственный *
						</label>
						<div className='relative'>
							{assignedTo ? (
								<div
									className='w-full px-4 py-2 border rounded bg-gray-50 cursor-pointer'
									onClick={() => setShowUserDropdown(!showUserDropdown)}
								>
									{`${assignedTo.surname} ${assignedTo.name} ${assignedTo.middleName}`}
								</div>
							) : (
								<div className='relative'>
									<input
										type='text'
										value={searchTerm}
										onChange={e => setSearchTerm(e.target.value)}
										onFocus={() => setShowUserDropdown(true)}
										className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
										placeholder='Начните вводить ФИО'
									/>
									{isUsersLoading && (
										<div className='absolute right-3 top-3'>
											<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400'></div>
										</div>
									)}
								</div>
							)}

							{showUserDropdown && (
								<div className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
									{filteredUsers.length > 0 ? (
										filteredUsers.map(user => (
											<div
												key={user.id}
												className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
												onClick={() => handleUserSelect(user)}
											>
												{`${user.surname} ${user.name} ${user.middleName}`}
											</div>
										))
									) : (
										<div className='px-4 py-2 text-gray-500'>
											{isUsersLoading
												? 'Загрузка...'
												: 'Пользователи не найдены'}
										</div>
									)}
								</div>
							)}
						</div>
						<input
							type='hidden'
							{...register('assignedTo', { required: true })}
						/>
						{errors.assignedTo && (
							<p className='text-red-500 text-sm mt-1'>Это поле обязательно</p>
						)}
					</div>

					{/* Дата дедлайна и приоритет */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Дата дедлайна *
							</label>
							<input
								type='date'
								{...register('dueDate', { required: true })}
								className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
							/>
							{errors.dueDate && (
								<p className='text-red-500 text-sm mt-1'>
									Это поле обязательно
								</p>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Приоритет *
							</label>
							<select
								{...register('priority', { required: true })}
								className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
							>
								{Object.values(Priority).map(priority => (
									<option key={priority} value={priority}>
										{priority === Priority.LOW && 'Низкий'}
										{priority === Priority.MEDIUM && 'Средний'}
										{priority === Priority.HIGH && 'Высокий'}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Статус */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Статус *
						</label>
						<select
							{...register('status', { required: true })}
							className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
						>
							{Object.values(TaskStatus).map(status => (
								<option key={status} value={status}>
									{status === TaskStatus.ACTIVE && 'Активная'}
									{status === TaskStatus.POSTPONED && 'Отложенная'}
									{status === TaskStatus.COMPLETED && 'Завершенная'}
								</option>
							))}
						</select>
					</div>

					{/* Описание */}
					<div className='flex-grow'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Описание
						</label>
						<Edit
							content={watch('description')}
							onChange={handleContentChange}
						/>
					</div>
				</div>

				{/* Кнопки */}
				<div className='sticky bottom-0 bg-white pt-4 flex justify-end gap-2'>
					<button
						type='button'
						onClick={handleClose}
						className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded'
					>
						Отмена
					</button>
					<button
						type='submit'
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						Создать
					</button>
				</div>
			</form>
		</div>
	)
}
