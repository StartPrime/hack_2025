'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Task from './task'
import { PlusIcon } from '@/lib/icons'
import { ITask, TaskStatus, ITaskLogs } from '@/interfaces'
import TaskDialog from './taskDialog'
import CreateTaskDialog from './addTaskDialog'
import { apiClient } from '@/fetch/apiClient'

const translateEventType = (eventType: string) => {
	const translations: Record<string, string> = {
		CREATE: 'Создание',
		UPDATE: 'Обновление',
		DELETE: 'Удаление',
		STATUS_CHANGE: 'Изменение статуса',
	}
	return translations[eventType] || eventType
}

const translateStatus = (status: string) => {
	const translations: Record<string, string> = {
		ACTIVE: 'Активная',
		POSTPONED: 'Отложенная',
		COMPLETED: 'Завершенная',
	}
	return translations[status] || status
}

export default function TasksContainer() {
	const viewDialogRef = useRef<HTMLDialogElement>(null)
	const createDialogRef = useRef<HTMLDialogElement>(null)
	const [tasks, setTasks] = useState<ITask[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<TaskStatus>(TaskStatus.ACTIVE)
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
	const [taskHistory, setTaskHistory] = useState<ITaskLogs[]>([])
	const [showHistory, setShowHistory] = useState(false)

	const fetchTasks = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const data: ITask[] = await apiClient('/tasks/', { method: 'GET' })
			setTasks(data)
		} catch (err) {
			console.error('Ошибка при загрузке задач:', err)
			setError('Не удалось загрузить задачи. Попробуйте позже.')
		} finally {
			setIsLoading(false)
		}
	}, [])

	const fetchTaskHistory = async () => {
		try {
			const response: ITaskLogs[] = await apiClient('/tasks/history/', {
				method: 'GET',
			})
			setTaskHistory(response.reverse())
		} catch (err) {
			console.error('Ошибка при загрузке истории:', err)
		}
	}

	useEffect(() => {
		fetchTasks()
	}, [fetchTasks])

	const handleTaskUpdated = useCallback(async () => {
		await fetchTasks()
		setShowHistory(false)
	}, [fetchTasks])

	const handleViewTask = (taskId: number) => {
		setSelectedTaskId(taskId)
		viewDialogRef.current?.showModal()
	}

	const toggleHistory = () => {
		setShowHistory(!showHistory)
		if (!showHistory) {
			fetchTaskHistory()
		}
	}

	const activeTasks = tasks.filter(task => task.status === TaskStatus.ACTIVE)
	const postponedTasks = tasks.filter(
		task => task.status === TaskStatus.POSTPONED
	)
	const completedTasks = tasks.filter(
		task => task.status === TaskStatus.COMPLETED
	)

	const getTasksForActiveTab = () => {
		switch (activeTab) {
			case TaskStatus.ACTIVE:
				return activeTasks
			case TaskStatus.POSTPONED:
				return postponedTasks
			case TaskStatus.COMPLETED:
				return completedTasks
			default:
				return []
		}
	}

	if (isLoading) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='bg-red-50 border-l-4 border-red-400 p-4'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<svg
								className='h-5 w-5 text-red-400'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm text-red-700'>{error}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<div className='flex justify-between sm:items-center mb-8 sm:flex-row flex-col'>
				<h1 className='text-2xl font-bold text-gray-900'>Задачи</h1>
				<div className='flex gap-3 max-sm:mt-4'>
					<button
						onClick={toggleHistory}
						className='sm:px-4 px-2 max-sm:text-xs py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer'
					>
						<span>{showHistory ? 'Скрыть историю' : 'История изменений'}</span>
					</button>

					<button
						onClick={() => createDialogRef.current?.showModal()}
						className='sm:px-4 px-2 max-sm:text-xs py-2 bg-primary text-white rounded-lg cursor-pointer transition-colors flex items-center gap-2'
					>
						<PlusIcon className='w-5 h-5' />
						<span>Добавить задачу</span>
					</button>
				</div>
			</div>

			{showHistory && (
				<div className='mb-8 bg-white shadow rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<h2 className='text-lg font-medium text-gray-900'>
							История изменений задач
						</h2>
					</div>
					<div className='overflow-x-auto'>
						<div className='max-h-96 overflow-y-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50 sticky top-0'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Задача
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Событие
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Изменил
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Дата
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Статус
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{taskHistory.map((item, index) => (
										<tr key={index}>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{item.taskName}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{translateEventType(item.eventType)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{item.changedBy.surname} {item.changedBy.name}{' '}
												{item.changedBy.middleName}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{new Date(item.changedAt).toLocaleString()}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{translateStatus(item.oldStatus)} →{' '}
												{translateStatus(item.newStatus)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			<div className='mb-6 border-b border-gray-200'>
				<nav className='flex sm:space-x-4 space-x-0'>
					<button
						onClick={() => setActiveTab(TaskStatus.ACTIVE)}
						className={`sm:px-4 py-2 font-medium sm:text-sm text-[10px] rounded-t-md border-b-2 flex items-center cursor-pointer ${
							activeTab === TaskStatus.ACTIVE
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Текущие задачи
						<span className='ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full'>
							{activeTasks.length}
						</span>
					</button>

					<button
						onClick={() => setActiveTab(TaskStatus.POSTPONED)}
						className={`sm:px-4 px-2 py-2 font-medium sm:text-sm text-[10px] rounded-t-md border-b-2 flex items-center cursor-pointer ${
							activeTab === TaskStatus.POSTPONED
								? 'border-purple-500 text-purple-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Отложенные задачи
						<span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full'>
							{postponedTasks.length}
						</span>
					</button>

					<button
						onClick={() => setActiveTab(TaskStatus.COMPLETED)}
						className={`sm:px-4 px-2 py-2 font-medium sm:text-sm text-[10px] rounded-t-md border-b-2 cursor-pointer ${
							activeTab === TaskStatus.COMPLETED
								? 'border-green-500 text-green-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Выполненные задачи
					</button>
				</nav>
			</div>

			{getTasksForActiveTab().length > 0 ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{getTasksForActiveTab().map(task => (
						<Task
							key={task.id}
							task={task}
							currentStatus={activeTab}
							onEdit={() => handleViewTask(task.id)}
						/>
					))}
				</div>
			) : (
				<div className='bg-gray-50 rounded-lg p-8 text-center'>
					<p className='text-gray-500'>Нет задач в этом разделе</p>
				</div>
			)}

			<dialog
				ref={viewDialogRef}
				className='p-0 w-full max-w-2xl rounded-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm m-auto'
			>
				<TaskDialog
					dialogRef={viewDialogRef}
					taskId={selectedTaskId}
					onTaskUpdated={handleTaskUpdated}
				/>
			</dialog>

			<dialog
				ref={createDialogRef}
				className='p-0 w-full max-w-2xl rounded-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm m-auto'
			>
				<CreateTaskDialog
					dialogRef={createDialogRef}
					onTaskCreated={handleTaskUpdated}
				/>
			</dialog>
		</div>
	)
}
