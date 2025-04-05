'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { IDetailedTask, ITask, TaskStatus, Priority } from '@/interfaces'

interface TaskContextMenuDialogProps {
	taskId: number | null
	onEdit?: (task: ITask) => void
	onDelete?: (id: number) => void
	onChangeStatus?: (id: number, status: TaskStatus) => void
}

export interface TaskDialogRef {
	openDialog: () => void
	closeDialog: () => void
}

const testTask: ITask & IDetailedTask = {
	id: taskId || 1,
	title: 'Тестовая задача',
	createAt: '2023-05-15',
	dueDate: '2023-06-01',
	priority: Priority.HIGH,
	status: TaskStatus.ACTIVE,
	description: 'Это тестовое описание задачи',
	createdBy: {
		name: 'Иван',
		surname: 'Петров',
		middleName: 'Сергеевич',
	},
	updatedBy: {
		name: 'Анна',
		surname: 'Смирнова',
		middleName: 'Игоревна',
	},
	assignedTo: {
		name: 'Дмитрий',
		surname: 'Козлов',
		middleName: 'Александрович',
	},
}

const TaskContextMenuDialog = forwardRef<
	TaskDialogRef,
	TaskContextMenuDialogProps
>(({ taskId, onEdit, onDelete, onChangeStatus }, ref) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [task, setTask] = useState<(ITask & IDetailedTask) | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// Методы для управления диалогом извне
	useImperativeHandle(ref, () => ({
		openDialog: () => {
			setIsLoading(true)
			// Здесь будет запрос на сервер
			// Пока используем тестовые данные
			setTimeout(() => {
				setTask(testTask)
				dialogRef.current?.showModal()
				setIsLoading(false)
			}, 500)
		},
		closeDialog: () => {
			dialogRef.current?.close()
		},
	}))

	const handleStatusChange = (status: TaskStatus) => {
		if (!taskId) return
		onChangeStatus?.(taskId, status)
		dialogRef.current?.close()
	}

	const handleEdit = () => {
		if (!task) return
		onEdit?.(task)
		dialogRef.current?.close()
	}

	const handleDelete = () => {
		if (!taskId) return
		onDelete?.(taskId)
		dialogRef.current?.close()
	}

	return (
		<dialog
			ref={dialogRef}
			className='w-full max-w-md p-0 rounded-lg backdrop:bg-black/50 animate-fade-in'
			onClose={() => setTask(null)}
		>
			{isLoading ? (
				<div className='p-6 text-center'>Загрузка задачи...</div>
			) : task ? (
				<div className='flex flex-col'>
					{/* Заголовок диалога */}
					<div className='sticky top-0 bg-white p-4 border-b flex justify-between items-center'>
						<h2 className='text-xl font-bold'>Управление задачей</h2>
						<button
							onClick={() => dialogRef.current?.close()}
							className='text-gray-400 hover:text-gray-600'
						>
							&times;
						</button>
					</div>

					{/* Основное содержимое */}
					<div className='p-6 space-y-4'>
						<div>
							<h3 className='text-lg font-semibold'>{task.title}</h3>
							<p className='text-sm text-gray-500 mt-1'>
								Создана: {new Date(task.createAt).toLocaleDateString()}
							</p>
						</div>

						<div>
							<h4 className='font-medium'>Описание:</h4>
							<p className='mt-1'>{task.description}</p>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div>
								<h4 className='font-medium'>Создал:</h4>
								<p>{`${task.createdBy.surname} ${task.createdBy.name} ${task.createdBy.middleName}`}</p>
							</div>
							<div>
								<h4 className='font-medium'>Обновил:</h4>
								<p>{`${task.updatedBy.surname} ${task.updatedBy.name} ${task.updatedBy.middleName}`}</p>
							</div>
						</div>

						<div>
							<h4 className='font-medium'>Исполнитель:</h4>
							<p>{`${task.assignedTo.surname} ${task.assignedTo.name} ${task.assignedTo.middleName}`}</p>
						</div>
					</div>

					{/* Футер с кнопками действий */}
					<div className='sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3'>
						<button
							onClick={handleEdit}
							className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
						>
							Редактировать
						</button>
						<button
							onClick={handleDelete}
							className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
						>
							Удалить
						</button>

						{task.status === 'ACTIVE' && (
							<button
								onClick={() => handleStatusChange(TaskStatus.POSTPONED)}
								className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
							>
								Отложить
							</button>
						)}

						{(task.status === 'ACTIVE' || task.status === 'POSTPONED') && (
							<button
								onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
								className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
							>
								Выполнить
							</button>
						)}

						{(task.status === 'POSTPONED' || task.status === 'COMPLETED') && (
							<button
								onClick={() => handleStatusChange(TaskStatus.ACTIVE)}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
							>
								В работу
							</button>
						)}
					</div>
				</div>
			) : (
				<div className='p-6 text-center'>Ошибка загрузки задачи</div>
			)}
		</dialog>
	)
})

TaskContextMenuDialog.displayName = 'TaskContextMenuDialog'

export default TaskContextMenuDialog
