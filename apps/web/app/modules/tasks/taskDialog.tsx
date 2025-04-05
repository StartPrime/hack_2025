// taskDialog.tsx
'use client'

import { RefObject, useEffect, useState } from 'react'
import { ITask, IDetailedTask, TaskStatus, Priority } from '@/interfaces'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	taskId?: number
}

export default function TaskDialog({ dialogRef, taskId }: Props) {
	const [isEdit, setIsEdit] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [currentTask, setCurrentTask] = useState<
		(ITask & IDetailedTask) | null
	>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
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

	// Заглушка для запроса задачи
	const fetchTask = async () => {
		setIsLoading(true)
		try {
			// Имитация запроса
			await new Promise(resolve => setTimeout(resolve, 500))

			// Статичная тестовая задача
			const mockTask: ITask & IDetailedTask = {
				id: taskId || 1,
				title: 'Тестовая задача',
				description: '<p>Это описание тестовой задачи</p>',
				createAt: '2023-05-15',
				dueDate: '2023-06-20',
				priority: Priority.HIGH,
				status: TaskStatus.ACTIVE,
				assignedTo: {
					name: 'Иван',
					surname: 'Иванов',
					middleName: 'Иванович',
				},
				createdBy: {
					name: 'Петр',
					surname: 'Петров',
					middleName: 'Петрович',
				},
				updatedBy: {
					name: 'Петр',
					surname: 'Петров',
					middleName: 'Петрович',
				},
			}

			setCurrentTask(mockTask)
			reset({
				title: mockTask.title,
				description: mockTask.description,
				assignedTo: mockTask.assignedTo,
				dueDate: mockTask.dueDate,
				priority: mockTask.priority,
				status: mockTask.status,
			})
		} catch (error) {
			console.error('Ошибка при загрузке задачи:', error)
		} finally {
			setIsLoading(false)
		}
	}

	// Обработчик мутаций для отслеживания открытия/закрытия диалога
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
					}
				}
			})
		})

		observer.observe(dialog, { attributes: true })

		return () => {
			observer.disconnect()
		}
	}, [taskId])

	const onSubmit = (data: any) => {
		console.log(isEdit ? 'Сохранение задачи:' : 'Создание задачи:', data)
		dialogRef.current?.close()
	}

	const handleContentChange = (content: string) => {
		setValue('description', content)
	}

	const handleClose = () => {
		dialogRef.current?.close()
	}

	const handleDelete = () => {
		console.log('Удаление задачи:', currentTask?.id)
		dialogRef.current?.close()
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
			{/* Шапка диалога */}
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

			{/* Форма */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col flex-grow p-6 overflow-y-auto'
			>
				<div className='space-y-6 flex-grow'>
					{/* Название задачи */}
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

					{/* Ответственный */}
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

					{/* Дата дедлайна и приоритет */}
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

					{/* Статус */}
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

					{/* Описание */}
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

				{/* Кнопки */}
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
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
							>
								{currentTask ? 'Сохранить' : 'Создать'}
							</button>
						</>
					)}
				</div>
			</form>
		</div>
	)
}
