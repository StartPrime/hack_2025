// tasksContainer.tsx
'use client'

import { useRef, useState } from 'react'
import Task from './task'
import { PlusIcon } from '@/lib/icons'
import { ITask, Priority, TaskStatus } from '@/interfaces'
import EditTaskDialog from './editTaskDialog'

const testTasks: ITask[] = [
	{
		id: 1,
		title: 'Разработать главную страницу',
		createAt: '2023-05-15',
		dueDate: '2023-06-01',
		priority: Priority.HIGH,
		status: TaskStatus.ACTIVE,
		assignedTo: {
			name: 'Иван',
			surname: 'Петров',
			middleName: 'Сергеевич',
		},
	},
	{
		id: 2,
		title: 'Написать API для авторизации',
		createAt: '2023-05-10',
		dueDate: '2023-05-25',
		priority: Priority.MEDIUM,
		status: TaskStatus.COMPLETED,
		assignedTo: {
			name: 'Анна',
			surname: 'Смирнова',
			middleName: 'Игоревна',
		},
	},
	{
		id: 3,
		title: 'Протестировать модуль платежей',
		createAt: '2023-05-18',
		dueDate: '2023-05-30',
		priority: Priority.LOW,
		status: TaskStatus.ACTIVE,
		assignedTo: {
			name: 'Дмитрий',
			surname: 'Козлов',
			middleName: 'Александрович',
		},
	},
	{
		id: 4,
		title: 'Обновить документацию',
		createAt: '2023-05-20',
		dueDate: '2023-06-05',
		priority: Priority.MEDIUM,
		status: TaskStatus.POSTPONED,
		assignedTo: {
			name: 'Елена',
			surname: 'Васильева',
			middleName: 'Дмитриевна',
		},
	},
]

export default function TasksContainer() {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [tasks, setTasks] = useState(testTasks)
	const [activeTab, setActiveTab] = useState<TaskStatus>(TaskStatus.ACTIVE)

	// Фильтрация задач по статусу
	const activeTasks = tasks.filter(task => task.status === TaskStatus.ACTIVE)
	const postponedTasks = tasks.filter(
		task => task.status === TaskStatus.POSTPONED
	)
	const completedTasks = tasks.filter(
		task => task.status === TaskStatus.COMPLETED
	)

	// Получение задач для активного раздела
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

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			{/* Заголовок и кнопка */}
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-2xl font-bold text-gray-900'>Задачи</h1>
				<button
					onClick={() => dialogRef.current?.showModal()}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
				>
					<PlusIcon className='w-5 h-5' />
					<span>Добавить задачу</span>
				</button>
			</div>

			{/* Табы разделов */}
			<div className='mb-6 border-b border-gray-200'>
				<nav className='flex space-x-4'>
					<button
						onClick={() => setActiveTab(TaskStatus.ACTIVE)}
						className={`px-3 py-2 font-medium text-sm rounded-t-md border-b-2 flex items-center cursor-pointer ${
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
						className={`px-3 py-2 font-medium text-sm rounded-t-md border-b-2 flex items-center cursor-pointer ${
							activeTab === TaskStatus.POSTPONED
								? 'border-purple-500 text-purple-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Отложенные задачи
						<span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer'>
							{postponedTasks.length}
						</span>
					</button>

					<button
						onClick={() => setActiveTab(TaskStatus.COMPLETED)}
						className={`px-3 py-2 font-medium text-sm rounded-t-md border-b-2 cursor-pointer ${
							activeTab === TaskStatus.COMPLETED
								? 'border-green-500 text-green-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Выполненные задачи
					</button>
				</nav>
			</div>

			{/* Сетка задач */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{getTasksForActiveTab().map(task => (
					<Task key={task.id} task={task} currentStatus={TaskStatus.ACTIVE} />
				))}
			</div>

			{/* Диалог добавления */}
			<dialog
				ref={dialogRef}
				className='p-0 w-full max-w-2xl rounded-xl backdrop:bg-black/50 m-auto'
			>
				<EditTaskDialog dialogRef={dialogRef} />
			</dialog>
		</div>
	)
}
