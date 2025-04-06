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
		try {
			const data: ITask & IDetailedTask = await apiClient(`/tasks/${taskId}`, {
				method: 'GET',
			})
			setTaskDetails(data)

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
		}
	}

	useEffect(() => {
		if (dialogRef.current?.open || taskId) {
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
					assignedTo: data.assignedTo.id,
					priority: data.priority,
					status: data.status,
					dueDate: `${data.dueDate}T00:00:00Z`,
				}

				await apiClient(`/tasks/update`, {
					method: 'PUT',
					body: JSON.stringify(taskData),
				})
			}

			if (taskId) {
				await fetchTaskDetails()
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

	return (
		<div className='flex flex-col h-full'>
			<div className='sticky top-0 z-10 bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm '>
				<h2 className='text-xl font-semibold text-gray-900'>
					{isEditMode ? 'Редактирование задачи' : 'Просмотр задачи'}
				</h2>
				<button
					onClick={handleClose}
					className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700'
					aria-label='Закрыть'
				>
					×
				</button>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col flex-grow p-6 overflow-y-auto'
			>
				<div className='space-y-4 flex-grow'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Название задачи {isEditMode && '*'}
						</label>
						{isEditMode ? (
							<input
								{...register('title', { required: true })}
								className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all placeholder:text-gray-400'
								placeholder='Введите название задачи'
							/>
						) : (
							<div className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50'>
								{taskDetails?.title || 'Нет названия'}
							</div>
						)}
						{errors.title && (
							<div className='flex items-center gap-1.5 mt-1.5 text-red-600 text-sm'>
								<svg
									className='w-4 h-4 shrink-0'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<path
										fillRule='evenodd'
										d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
										clipRule='evenodd'
									/>
								</svg>
								Это поле обязательно
							</div>
						)}
					</div>

					<div className='relative'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Ответственный {isEditMode && '*'}
						</label>
						{isEditMode ? (
							<div className='relative'>
								{assignedTo ? (
									<div
										className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors'
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
											className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all placeholder:text-gray-400'
											placeholder='Начните вводить ФИО'
										/>
										{isUsersLoading && (
											<div className='absolute right-3 top-3.5'>
												<div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent'></div>
											</div>
										)}
									</div>
								)}

								{showUserDropdown && (
									<div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto divide-y divide-gray-100'>
										{filteredUsers.length > 0 ? (
											filteredUsers.map(user => (
												<div
													key={user.id}
													className='px-4 py-3 hover:bg-blue-50/80 transition-colors cursor-pointer text-gray-700 hover:text-blue-800'
													onClick={() => handleUserSelect(user)}
												>
													{`${user.surname} ${user.firstName} ${user.middleName}`}
												</div>
											))
										) : (
											<div className='px-4 py-3 text-gray-500'>
												{isUsersLoading
													? 'Загрузка...'
													: 'Пользователи не найдены'}
											</div>
										)}
									</div>
								)}
							</div>
						) : (
							<div className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50'>
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
							<div className='flex items-center gap-1.5 mt-1.5 text-red-600 text-sm'>
								<svg
									className='w-4 h-4 shrink-0'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<path
										fillRule='evenodd'
										d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
										clipRule='evenodd'
									/>
								</svg>
								Это поле обязательно
							</div>
						)}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Дата дедлайна {isEditMode && '*'}
							</label>
							{isEditMode ? (
								<input
									type='date'
									{...register('dueDate', { required: true })}
									className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all cursor-pointer'
								/>
							) : (
								<div className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50'>
									{taskDetails?.dueDate.split('T')[0] || 'Не установлена'}
								</div>
							)}
							{errors.dueDate && (
								<div className='flex items-center gap-1.5 mt-1.5 text-red-600 text-sm'>
									<svg
										className='w-4 h-4 shrink-0'
										fill='currentColor'
										viewBox='0 0 20 20'
									>
										<path
											fillRule='evenodd'
											d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
											clipRule='evenodd'
										/>
									</svg>
									Это поле обязательно
								</div>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Приоритет {isEditMode && '*'}
							</label>
							{isEditMode ? (
								<select
									{...register('priority', { required: true })}
									className='w-full px-4 py-2.5 border border-gray-300 cursor-pointer rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none bg-select-chevron bg-no-repeat bg-right-2'
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
								<div className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50'>
									{taskDetails?.priority === Priority.LOW && 'Низкий'}
									{taskDetails?.priority === Priority.MEDIUM && 'Средний'}
									{taskDetails?.priority === Priority.HIGH && 'Высокий'}
								</div>
							)}
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Статус {isEditMode && '*'}
						</label>
						{isEditMode ? (
							<select
								{...register('status', { required: true })}
								className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none bg-select-chevron bg-no-repeat bg-right-2'
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
							<div className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50'>
								{taskDetails?.status === TaskStatus.ACTIVE && 'Активная'}
								{taskDetails?.status === TaskStatus.POSTPONED && 'Отложенная'}
								{taskDetails?.status === TaskStatus.COMPLETED && 'Завершенная'}
							</div>
						)}
					</div>

					<div className='flex-grow'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Описание
						</label>
						{isEditMode ? (
							<Edit
								content={watch('description')}
								onChange={handleContentChange}
							/>
						) : (
							<div
								className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] prose prose-sm'
								dangerouslySetInnerHTML={{
									__html: taskDetails?.description || 'Нет описания',
								}}
							/>
						)}
					</div>
				</div>

				<div className='sticky bottom-0 bg-white pt-6 pb-2 flex justify-end gap-3 border-t border-gray-100 mt-6'>
					{!isEditMode && taskDetails && (
						<>
							<button
								type='button'
								onClick={handleDelete}
								className='px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium cursor-pointer'
							>
								Удалить
							</button>
							<button
								type='button'
								onClick={() => setIsEditMode(true)}
								className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium cursor-pointer'
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
								className='px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium cursor-pointer'
							>
								Отмена
							</button>
							<button
								type='submit'
								disabled={isSubmitting}
								className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer font-medium disabled:opacity-70 disabled:cursor-not-allowed'
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
