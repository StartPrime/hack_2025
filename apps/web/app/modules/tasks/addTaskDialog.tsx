'use client'

import { RefObject, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'
import { TaskStatus, Priority } from '@/interfaces'
import { apiClient } from '@/fetch/apiClient'

interface User {
	id: string
	firstName: string
	surname: string
	middleName: string
}

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	onTaskCreated?: () => Promise<void>
}

interface FormData {
	title: string
	assignedTo: User | null
	dueDate: string
	priority: Priority
	status: TaskStatus
	description: string
}

export default function CreateTaskDialog({ dialogRef, onTaskCreated }: Props) {
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

	const onSubmit = async (data: FormData) => {
		try {
			const taskData = {
				title: data.title,
				description: data.description,
				assignedTo: data.assignedTo?.id || '',
				priority: data.priority,
				status: data.status,
				dueDate: `${data.dueDate}T00:00:00Z`,
			}

			await apiClient('/tasks/', {
				method: 'POST',
				body: JSON.stringify(taskData),
			})

			dialogRef.current?.close()
			reset()
			onTaskCreated?.()
		} catch (error) {
			console.error('Ошибка при создании задачи:', error)
		}
	}

	const handleContentChange = (content: string) => {
		setValue('description', content)
	}

	const handleClose = () => {
		dialogRef.current?.close()
		reset()
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
		<div className='flex flex-col'>
			<div className='sticky top-0 z-10 bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm'>
				<h2 className='text-xl font-semibold text-gray-900'>
					Создание новой задачи
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
				<div className='space-y-6 flex-grow'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Название задачи *
						</label>
						<input
							{...register('title', { required: true })}
							className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all placeholder:text-gray-400'
							placeholder='Введите название задачи'
						/>
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
							Ответственный *
						</label>
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
						<input
							type='hidden'
							{...register('assignedTo', { required: true })}
						/>
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
								Дата дедлайна *
							</label>
							<input
								type='date'
								{...register('dueDate', { required: true })}
								className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all'
							/>
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
								Приоритет *
							</label>
							<select
								{...register('priority', { required: true })}
								className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none bg-select-chevron bg-no-repeat bg-right-2'
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

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Статус *
						</label>
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
					</div>

					<div className='flex-grow'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Описание
						</label>
						<Edit
							content={watch('description')}
							onChange={handleContentChange}
						/>
					</div>
				</div>

				<div className='sticky bottom-0 bg-white pt-6 pb-2 flex justify-end gap-3 border-t border-gray-100 mt-6'>
					<button
						type='button'
						onClick={handleClose}
						className='px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium cursor-pointer'
					>
						Отмена
					</button>
					<button
						type='submit'
						disabled={isSubmitting}
						className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer'
					>
						{isSubmitting ? 'Создание...' : 'Создать'}
					</button>
				</div>
			</form>
		</div>
	)
}
