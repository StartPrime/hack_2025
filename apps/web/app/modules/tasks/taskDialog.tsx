'use client'

import { RefObject, useEffect, useState } from 'react'
import { ITask, IDetailedTask, TaskStatus, Priority } from '@/interfaces'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'
import { apiClient } from '@/fetch/apiClient'

interface User {
	id: string
	firstName: string
	surname: string
	middleName: string
}

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	taskId?: number | null
	onTaskUpdated?: () => Promise<void>
}

export default function TaskDialog({
	dialogRef,
	taskId,
	onTaskUpdated,
}: Props) {
	const [isEditMode, setIsEditMode] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [taskDetails, setTaskDetails] = useState<
		(ITask & IDetailedTask) | null
	>(null)
	const [users, setUsers] = useState<User[]>([])
	const [isUsersLoading, setIsUsersLoading] = useState(false)
	const [showUserDropdown, setShowUserDropdown] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
		reset,
	} = useForm({
		defaultValues: {
			title: '',
			description: '',
			assignedTo: null as User | null,
			dueDate: '',
			priority: Priority.MEDIUM,
			status: TaskStatus.ACTIVE,
		},
	})

	// Загрузка списка пользователей
	useEffect(() => {
		const fetchUsers = async () => {
			setIsUsersLoading(true)
			try {
				const users: User[] = await apiClient('/users/', { method: 'GET' })
				setUsers(users)
			} catch (error) {
				console.error('Ошибка при загрузке пользователей:', error)
			} finally {
				setIsUsersLoading(false)
			}
		}

		fetchUsers()
	}, [])

	const fetchTaskDetails = async () => {
		if (!taskId) return

		setIsLoading(true)
		try {
			const data: ITask & IDetailedTask = await apiClient(`/tasks/${taskId}`, {
				method: 'GET',
			})
			setTaskDetails(data)

			// Находим пользователя в списке по ФИО
			const assignedUser = users.find(
				u =>
					u.surname === data.assignedTo.surname &&
					u.firstName === data.assignedTo.name &&
					u.middleName === data.assignedTo.middleName
			)

			reset({
				title: data.title,
				description: data.description,
				assignedTo: assignedUser || null,
				dueDate: data.dueDate.split('T')[0],
				priority: data.priority,
				status: data.status,
			})
		} catch (error) {
			console.error('Ошибка при загрузке задачи:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (dialogRef.current?.open && taskId) {
			fetchTaskDetails()
		} else {
			setIsEditMode(false)
			setTaskDetails(null)
			reset()
		}
	}, [taskId, dialogRef.current?.open, users])

	const onSubmit = async (data: any) => {
		try {
			if (taskDetails && data.assignedTo) {
				const taskData = {
					id: taskDetails.id,
					title: data.title,
					description: data.description,
					assignedTo: data.assignedTo.id, // Отправляем ID пользователя
					priority: data.priority,
					status: data.status,
					dueDate: `${data.dueDate}T00:00:00Z`,
				}

				await apiClient(`/tasks/update`, {
					method: 'PUT',
					body: JSON.stringify(taskData),
				})
			}

			dialogRef.current?.close()
			onTaskUpdated?.()
		} catch (error) {
			console.error('Ошибка при сохранении задачи:', error)
		}
	}

	const handleContentChange = (content: string) => {
		setValue('description', content)
	}

	const handleClose = () => {
		dialogRef.current?.close()
	}

	const handleDelete = async () => {
		try {
			if (taskDetails) {
				await apiClient(`/tasks/${taskDetails.id}`, { method: 'DELETE' })
				dialogRef.current?.close()
				onTaskUpdated?.()
			}
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error)
		}
	}

	const handleUserSelect = (user: User) => {
		setValue('assignedTo', user)
		setShowUserDropdown(false)
		setSearchTerm('')
	}

	const filteredUsers = users.filter(user => {
		const fullName =
			`${user.surname} ${user.firstName} ${user.middleName}`.toLowerCase()
		return fullName.includes(searchTerm.toLowerCase())
	})

	const assignedTo = watch('assignedTo')

	if (isLoading) {
		return (
			<div className='flex flex-col h-full items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
				<p className='mt-4 text-gray-600'>Загрузка задачи...</p>
			</div>
		)
	}

	return (
		<div className='flex flex-col h-full'>
			<div className='sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center'>
				<h2 className='text-xl font-bold text-gray-800'>
					{isEditMode ? 'Редактирование задачи' : 'Просмотр задачи'}
				</h2>
				<button
					onClick={handleClose}
					className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
					aria-label='Закрыть'
				>
					×
				</button>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col flex-grow p-6 overflow-y-auto'
			>
				<div className='space-y-6 flex-grow'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Название задачи {isEditMode && '*'}
						</label>
						{isEditMode ? (
							<input
								{...register('title', { required: true })}
								className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								placeholder='Введите название задачи'
							/>
						) : (
							<div className='w-full px-4 py-2 border rounded bg-gray-50'>
								{taskDetails?.title || 'Нет названия'}
							</div>
						)}
						{errors.title && (
							<p className='text-red-500 text-sm mt-1'>Это поле обязательно</p>
						)}
					</div>

					<div className='relative'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Ответственный {isEditMode && '*'}
						</label>
						{isEditMode ? (
							<div className='relative'>
								{assignedTo ? (
									<div
										className='w-full px-4 py-2 border rounded bg-gray-50 cursor-pointer'
										onClick={() => setShowUserDropdown(!showUserDropdown)}
									>
										{`${assignedTo.surname} ${assignedTo.firstName} ${assignedTo.middleName}`}
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
													{`${user.surname} ${user.firstName} ${user.middleName}`}
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
						) : (
							<div className='w-full px-4 py-2 border rounded bg-gray-50'>
								{taskDetails
									? `${taskDetails.assignedTo.surname} ${taskDetails.assignedTo.name} ${taskDetails.assignedTo.middleName}`
									: 'Не назначен'}
							</div>
						)}
						{isEditMode && (
							<input
								type='hidden'
								{...register('assignedTo', { required: true })}
							/>
						)}
						{errors.assignedTo && (
							<p className='text-red-500 text-sm mt-1'>Это поле обязательно</p>
						)}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Дата дедлайна {isEditMode && '*'}
							</label>
							{isEditMode ? (
								<input
									type='date'
									{...register('dueDate', { required: true })}
									className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								/>
							) : (
								<div className='w-full px-4 py-2 border rounded bg-gray-50'>
									{taskDetails?.dueDate.split('T')[0] || 'Не установлена'}
								</div>
							)}
							{errors.dueDate && (
								<p className='text-red-500 text-sm mt-1'>
									Это поле обязательно
								</p>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Приоритет {isEditMode && '*'}
							</label>
							{isEditMode ? (
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
							) : (
								<div className='w-full px-4 py-2 border rounded bg-gray-50'>
									{taskDetails?.priority === Priority.LOW && 'Низкий'}
									{taskDetails?.priority === Priority.MEDIUM && 'Средний'}
									{taskDetails?.priority === Priority.HIGH && 'Высокий'}
								</div>
							)}
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Статус {isEditMode && '*'}
						</label>
						{isEditMode ? (
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
						) : (
							<div className='w-full px-4 py-2 border rounded bg-gray-50'>
								{taskDetails?.status === TaskStatus.ACTIVE && 'Активная'}
								{taskDetails?.status === TaskStatus.POSTPONED && 'Отложенная'}
								{taskDetails?.status === TaskStatus.COMPLETED && 'Завершенная'}
							</div>
						)}
					</div>

					<div className='flex-grow'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Описание
						</label>
						{isEditMode ? (
							<Edit
								content={watch('description')}
								onChange={handleContentChange}
							/>
						) : (
							<div
								className='w-full px-4 py-2 border rounded bg-gray-50 min-h-[200px]'
								dangerouslySetInnerHTML={{
									__html: taskDetails?.description || 'Нет описания',
								}}
							/>
						)}
					</div>
				</div>

				<div className='sticky bottom-0 bg-white pt-4 flex justify-end gap-2'>
					{!isEditMode && taskDetails && (
						<>
							<button
								type='button'
								onClick={handleDelete}
								className='px-4 py-2 text-red-600 hover:bg-red-50 rounded'
							>
								Удалить
							</button>
							<button
								type='button'
								onClick={() => setIsEditMode(true)}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
							>
								Редактировать
							</button>
						</>
					)}

					{isEditMode && (
						<>
							<button
								type='button'
								onClick={() => setIsEditMode(false)}
								className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded'
							>
								Отмена
							</button>
							<button
								type='submit'
								disabled={isSubmitting}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed'
							>
								{isSubmitting ? 'Сохранение...' : 'Сохранить'}
							</button>
						</>
					)}
				</div>
			</form>
		</div>
	)
}
