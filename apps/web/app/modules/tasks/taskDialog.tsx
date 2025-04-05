// taskDialog.tsx
'use client'

import { RefObject, useState } from 'react'
import { ITask, IDetailedTask, Priority, TaskStatus } from '@/interfaces'
import EditTaskDialog from './editTaskDialog'
import { formatDate } from '@/lib/utils'

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	taskId: number
}

const testTask: ITask & IDetailedTask = {
	id: 1,
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

export default function TaskDialog({ dialogRef, taskId }: Props) {
	const [isEdit, setIsEdit] = useState(false)

	const handleDelete = () => {
		console.log('Удаление задачи с ID:', taskId)
		dialogRef.current?.close()
	}

	const handleStatusChange = (
		newStatus: 'ACTIVE' | 'POSTPONED' | 'COMPLETED'
	) => {
		console.log('Изменение статуса задачи', taskId, 'на', newStatus)
		dialogRef.current?.close()
	}

	return (
		<dialog
			ref={dialogRef}
			className='fixed inset-0 m-auto p-0 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm overflow-auto animate-fade-in'
		>
			{!isEdit ? (
				<div className='flex flex-col h-full'>
					{/* Шапка диалога */}
					<div className='sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center'>
						<h2 className='text-xl font-bold text-gray-800'>Просмотр задачи</h2>
						<button
							onClick={() => dialogRef.current?.close()}
							className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
							aria-label='Закрыть'
						>
							×
						</button>
					</div>

					{/* Основное содержимое */}
					<div className='overflow-y-auto p-6'>
						<div className='mb-8'>
							<div className='flex justify-between'>
								<h1 className='text-3xl font-bold text-gray-900 mb-4'>
									{testTask.title}
								</h1>
								<button
									onClick={() => setIsEdit(true)}
									className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
								>
									Редактировать
								</button>
							</div>

							<div className='flex flex-wrap gap-4 text-sm text-gray-600 mb-6'>
								<div className='flex items-center gap-2'>
									<span>Создана: {formatDate(testTask.createAt)}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span>Срок: {formatDate(testTask.dueDate)}</span>
								</div>
							</div>
						</div>

						{/* Описание задачи */}
						<div className='mb-6'>
							<h3 className='text-lg font-medium mb-2'>Описание</h3>
							<p>{testTask.description}</p>
						</div>

						{/* Ответственные */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<h3 className='text-sm font-medium text-gray-500 mb-1'>
									Создал
								</h3>
								<p>{`${testTask.createdBy.surname} ${testTask.createdBy.name} ${testTask.createdBy.middleName}`}</p>
							</div>
							<div>
								<h3 className='text-sm font-medium text-gray-500 mb-1'>
									Обновил
								</h3>
								<p>{`${testTask.updatedBy.surname} ${testTask.updatedBy.name} ${testTask.updatedBy.middleName}`}</p>
							</div>
							<div>
								<h3 className='text-sm font-medium text-gray-500 mb-1'>
									Исполнитель
								</h3>
								<p>{`${testTask.assignedTo.surname} ${testTask.assignedTo.name} ${testTask.assignedTo.middleName}`}</p>
							</div>
						</div>
					</div>

					{/* Подвал диалога */}
					<div className='sticky bottom-0 bg-white p-4 flex justify-between'>
						<div className='flex gap-2'>
							{testTask.status === 'ACTIVE' && (
								<button
									onClick={() => handleStatusChange('POSTPONED')}
									className='px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200'
								>
									Отложить
								</button>
							)}
							{testTask.status !== 'COMPLETED' && (
								<button
									onClick={() => handleStatusChange('COMPLETED')}
									className='px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200'
								>
									Выполнить
								</button>
							)}
							{testTask.status !== 'ACTIVE' && (
								<button
									onClick={() => handleStatusChange('ACTIVE')}
									className='px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
								>
									В работу
								</button>
							)}
						</div>
						<div className='flex gap-2'>
							<button
								onClick={handleDelete}
								className='px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200'
							>
								Удалить
							</button>
							<button
								onClick={() => dialogRef.current?.close()}
								className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded'
							>
								Закрыть
							</button>
						</div>
					</div>
				</div>
			) : (
				<EditTaskDialog
					dialogRef={dialogRef}
					task={testTask}
					onClose={() => setIsEdit(false)}
				/>
			)}
		</dialog>
	)
}
