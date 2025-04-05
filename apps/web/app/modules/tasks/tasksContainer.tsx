// tasksContainer.tsx
'use client'

import { useState } from 'react'
import Container from '@/components/container'
import { ITask, TaskStatus } from '@/interfaces'
import Task from './task'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
	tasks: ITask[]
}

export default function TasksContainer({ tasks }: Props) {
	const [activeTab, setActiveTab] = useState<TaskStatus>(TaskStatus.ACTIVE)

	const filteredTasks = tasks.filter(task => task.status === activeTab)
	const activeCount = tasks.filter(t => t.status === TaskStatus.ACTIVE).length
	const postponedCount = tasks.filter(
		t => t.status === TaskStatus.POSTPONED
	).length

	return (
		<main className='py-6'>
			<Container>
				<div className='mb-6 border-b border-gray-200'>
					<nav className='flex space-x-4' aria-label='Tabs'>
						<button
							onClick={() => setActiveTab(TaskStatus.ACTIVE)}
							className={cn(
								'px-3 py-2 font-medium text-sm rounded-t-md flex items-center border-b-2 cursor-pointer',
								activeTab === TaskStatus.ACTIVE
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							)}
						>
							Текущие задачи
							<span className='ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full'>
								{activeCount}
							</span>
						</button>

						<button
							onClick={() => setActiveTab(TaskStatus.POSTPONED)}
							className={cn(
								'px-3 py-2 font-medium text-sm rounded-t-md flex items-center border-b-2 cursor-pointer',
								activeTab === TaskStatus.POSTPONED
									? 'border-purple-500 text-purple-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							)}
						>
							Отложенные задачи
							<span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full'>
								{postponedCount}
							</span>
						</button>

						<button
							onClick={() => setActiveTab(TaskStatus.COMPLETED)}
							className={cn(
								'px-3 py-2 font-medium text-sm rounded-t-md border-b-2 cursor-pointer',
								activeTab === TaskStatus.COMPLETED
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							)}
						>
							Выполненные задачи
						</button>
					</nav>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredTasks.map(task => (
						<Task key={task.id} task={task} currentStatus={task.status} />
					))}
				</div>
			</Container>
		</main>
	)
}
