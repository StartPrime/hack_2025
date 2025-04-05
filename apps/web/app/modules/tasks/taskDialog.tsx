'use client'

import { RefObject, useEffect, useState } from 'react'
import { ITask, IDetailedTask, TaskStatus, Priority } from '@/interfaces'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'
import { apiClient } from '@/fetch/apiClient'

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
	const [isEdit, setIsEdit] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [currentTask, setCurrentTask] = useState<
		(ITask & IDetailedTask) | null
	>(null)

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
			assignedTo: {
				name: '',
				surname: '',
				middleName: '',
			},
			dueDate: '',
			priority: Priority.MEDIUM,
			status: TaskStatus.ACTIVE,
		},
	})

	const fetchTask = async () => {
		setIsLoading(true)
		try {
			const data: ITask & IDetailedTask = await apiClient(`/tasks/${taskId}`, {
				method: 'GET',
			})
			setCurrentTask(data)
			reset({
				title: data.title,
				description: data.description,
				assignedTo: data.assignedTo,
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
		const dialog = dialogRef.current
		if (!dialog) return

		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.attributeName === 'open') {
					if (dialog.open && taskId) {
						fetchTask()
					} else {
						setIsEdit(false)
						setCurrentTask(null)
						reset()
					}
				}
			})
		})

		observer.observe(dialog, { attributes: true })
		return () => observer.disconnect()
	}, [taskId])

	const onSubmit = async (data: any) => {
		try {
			if (currentTask) {
				await apiClient(`/tasks/update`, {
					method: 'POST',
					body: JSON.stringify({
						...data,
						dueDate: `${data.dueDate}T00:00:00Z`,
					}),
				})
			} else {
				await apiClient('/tasks/', {
					method: 'POST',
					body: JSON.stringify({
						...data,
						dueDate: `${data.dueDate}T00:00:00Z`,
					}),
				})
			}

			dialogRef.current?.close()
			onTaskUpdated && (await onTaskUpdated())
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
			await apiClient(`/tasks/${currentTask?.id}`, { method: 'DELETE' })
			dialogRef.current?.close()
			onTaskUpdated && (await onTaskUpdated())
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error)
		}
	}

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
					{isEdit
						? currentTask
							? 'Редактирование задачи'
							: 'Создание новой задачи'
						: 'Просмотр задачи'}
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
							Название задачи {isEdit && '*'}
						</label>
						{isEdit ? (
							<input
								{...register('title', { required: true })}
								className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								placeholder='Введите название задачи'
							/>
						) : (
							<div className='w-full px-4 py-2 border rounded bg-gray-50'>
								{currentTask?.title || 'Нет названия'}
							</div>
						)}
						{errors.title && (
							<p className='text-red-500 text-sm mt-1'>Это поле обязательно</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Ответственный
						</label>
						{isEdit ? (
							<div className='grid grid-cols-3 gap-4'>
								<input
									{...register('assignedTo.name')}
									className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Имя'
								/>
								<input
									{...register('assignedTo.surname')}
									className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Фамилия'
								/>
								<input
									{...register('assignedTo.middleName')}
									className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Отчество'
								/>
							</div>
						) : (
							<div className='w-full px-4 py-2 border rounded bg-gray-50'>
								{currentTask
									? `${currentTask.assignedTo.surname} ${currentTask.assignedTo.name} ${currentTask.assignedTo.middleName}`
									: 'Не назначен'}
							</div>
						)}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Дата дедлайна
							</label>
							{isEdit ? (
								<input
									type='date'
									{...register('dueDate')}
									className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								/>
							) : (
								<div className='w-full px-4 py-2 border rounded bg-gray-50'>
									{currentTask?.dueDate || 'Не установлена'}
								</div>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Приоритет
							</label>
							{isEdit ? (
								<select
									{...register('priority')}
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
									{currentTask?.priority === Priority.LOW && 'Низкий'}
									{currentTask?.priority === Priority.MEDIUM && 'Средний'}
									{currentTask?.priority === Priority.HIGH && 'Высокий'}
								</div>
							)}
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Статус
						</label>
						{isEdit ? (
							<select
								{...register('status')}
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
								{currentTask?.status === TaskStatus.ACTIVE && 'Активная'}
								{currentTask?.status === TaskStatus.POSTPONED && 'Отложенная'}
								{currentTask?.status === TaskStatus.COMPLETED && 'Завершенная'}
							</div>
						)}
					</div>

					<div className='flex-grow'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Описание
						</label>
						{isEdit ? (
							<Edit
								content={watch('description')}
								onChange={handleContentChange}
							/>
						) : (
							<div
								className='w-full px-4 py-2 border rounded bg-gray-50 min-h-[200px]'
								dangerouslySetInnerHTML={{
									__html: currentTask?.description || 'Нет описания',
								}}
							/>
						)}
					</div>
				</div>

				<div className='sticky bottom-0 bg-white pt-4 flex justify-end gap-2'>
					{!isEdit && currentTask && (
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
								onClick={() => setIsEdit(true)}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
							>
								Редактировать
							</button>
						</>
					)}

					{isEdit && (
						<>
							<button
								type='button'
								onClick={() => setIsEdit(false)}
								className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded'
							>
								Отмена
							</button>
							<button
								type='submit'
								disabled={isSubmitting}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed'
							>
								{isSubmitting
									? 'Сохранение...'
									: currentTask
										? 'Сохранить'
										: 'Создать'}
							</button>
						</>
					)}
				</div>
			</form>
		</div>
	)
}
