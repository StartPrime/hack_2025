'use client'

import { useEffect } from 'react'
import { apiClient } from '@/fetch/apiClient'
import { ITask } from '@/interfaces'

export default function taskContainer() {
	useEffect(() => {
		const response = async () => {
			const data: ITask[] = await apiClient('/tasks/', { method: 'GET' })
			console.log(data)
		}
		response()
	}, [])
	return <div>123</div>
}

// import { useRef, useState, useEffect, useCallback } from 'react'
// import Task from './task'
// import { PlusIcon } from '@/lib/icons'
// import { ITask, TaskStatus } from '@/interfaces'
// import TaskDialog from './taskDialog'
// import { apiClient } from '@/fetch/apiClient'

// export default function TasksContainer() {
// 	const dialogRef = useRef<HTMLDialogElement>(null)
// 	const [tasks, setTasks] = useState<ITask[]>([])
// 	const [isLoading, setIsLoading] = useState(true)
// 	const [error, setError] = useState<string | null>(null)
// 	const [activeTab, setActiveTab] = useState<TaskStatus>(TaskStatus.ACTIVE)
// 	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

// 	const fetchTasks = useCallback(async () => {
// 		setIsLoading(true)
// 		setError(null)
// 		try {
// 			const data: ITask[] = await apiClient('/tasks/', { method: 'GET' })
// 			setTasks(data)
// 		} catch (err) {
// 			console.error('Ошибка при загрузке задач:', err)
// 			setError('Не удалось загрузить задачи. Попробуйте позже.')
// 		} finally {
// 			setIsLoading(false)
// 		}
// 	}, [])

// 	useEffect(() => {
// 		fetchTasks()
// 	}, [fetchTasks])

// 	const handleTaskUpdated = useCallback(async () => {
// 		await fetchTasks()
// 	}, [fetchTasks])

// 	const handleEditTask = (taskId: number) => {
// 		setSelectedTaskId(taskId)
// 		dialogRef.current?.showModal()
// 	}

// 	const activeTasks = tasks.filter(task => task.status === TaskStatus.ACTIVE)
// 	const postponedTasks = tasks.filter(
// 		task => task.status === TaskStatus.POSTPONED
// 	)
// 	const completedTasks = tasks.filter(
// 		task => task.status === TaskStatus.COMPLETED
// 	)

// 	const getTasksForActiveTab = () => {
// 		switch (activeTab) {
// 			case TaskStatus.ACTIVE:
// 				return activeTasks
// 			case TaskStatus.POSTPONED:
// 				return postponedTasks
// 			case TaskStatus.COMPLETED:
// 				return completedTasks
// 			default:
// 				return []
// 		}
// 	}

// 	if (isLoading) {
// 		return (
// 			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
// 				<div className='flex justify-center items-center h-64'>
// 					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
// 				</div>
// 			</div>
// 		)
// 	}

// 	if (error) {
// 		return (
// 			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
// 				<div className='bg-red-50 border-l-4 border-red-400 p-4'>
// 					<div className='flex'>
// 						<div className='flex-shrink-0'>
// 							<svg
// 								className='h-5 w-5 text-red-400'
// 								viewBox='0 0 20 20'
// 								fill='currentColor'
// 							>
// 								<path
// 									fillRule='evenodd'
// 									d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
// 									clipRule='evenodd'
// 								/>
// 							</svg>
// 						</div>
// 						<div className='ml-3'>
// 							<p className='text-sm text-red-700'>{error}</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}

// 	return (
// 		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
// 			<div className='flex justify-between items-center mb-8'>
// 				<h1 className='text-2xl font-bold text-gray-900'>Задачи</h1>
// 				<button
// 					onClick={() => {
// 						setSelectedTaskId(null)
// 						dialogRef.current?.showModal()
// 					}}
// 					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-poi'
// 				>
// 					<PlusIcon className='w-5 h-5' />
// 					<span>Добавить задачу</span>
// 				</button>
// 			</div>
// 			<div className='mb-6 border-b border-gray-200'>
// 				<nav className='flex space-x-4'>
// 					<button
// 						onClick={() => setActiveTab(TaskStatus.ACTIVE)}
// 						className={`px-3 py-2 font-medium text-sm rounded-t-md border-b-2 flex items-center cursor-pointer ${
// 							activeTab === TaskStatus.ACTIVE
// 								? 'border-blue-500 text-blue-600'
// 								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// 						}`}
// 					>
// 						Текущие задачи
// 						<span className='ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full'>
// 							{activeTasks.length}
// 						</span>
// 					</button>

// 					<button
// 						onClick={() => setActiveTab(TaskStatus.POSTPONED)}
// 						className={`px-3 py-2 font-medium text-sm rounded-t-md border-b-2 flex items-center cursor-pointer ${
// 							activeTab === TaskStatus.POSTPONED
// 								? 'border-purple-500 text-purple-600'
// 								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// 						}`}
// 					>
// 						Отложенные задачи
// 						<span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer'>
// 							{postponedTasks.length}
// 						</span>
// 					</button>

// 					<button
// 						onClick={() => setActiveTab(TaskStatus.COMPLETED)}
// 						className={`px-3 py-2 font-medium text-sm rounded-t-md border-b-2 cursor-pointer ${
// 							activeTab === TaskStatus.COMPLETED
// 								? 'border-green-500 text-green-600'
// 								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// 						}`}
// 					>
// 						Выполненные задачи
// 					</button>
// 				</nav>
// 			</div>
// 			{getTasksForActiveTab().length > 0 ? (
// 				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
// 					{getTasksForActiveTab().map(task => (
// 						<Task
// 							key={task.id}
// 							task={task}
// 							currentStatus={TaskStatus.ACTIVE}
// 							onEdit={() => handleEditTask(task.id)}
// 						/>
// 					))}
// 				</div>
// 			) : (
// 				<div className='bg-gray-50 rounded-lg p-8 text-center'>
// 					<p className='text-gray-500'>Нет задач в этом разделе</p>
// 				</div>
// 			)}
// 			<dialog
// 				ref={dialogRef}
// 				className='p-0 w-full max-w-2xl rounded-xl backdrop:bg-black/50 m-auto'
// 			>
// 				<TaskDialog
// 					dialogRef={dialogRef}
// 					taskId={selectedTaskId}
// 					onTaskUpdated={handleTaskUpdated}
// 				/>
// 			</dialog>
// 		</div>
// 	)
// }
