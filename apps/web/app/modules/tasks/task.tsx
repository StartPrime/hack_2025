'use client'

import { ITask, TaskStatus } from '@/interfaces'
import { formatDate } from '@/lib/utils'

interface TaskProps {
	task: ITask
	currentStatus: TaskStatus
	onEdit?: () => void
}

export default function Task({ task, currentStatus, onEdit }: TaskProps) {
	return (
		<article
			className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer'
			onClick={onEdit}
		>
			<div className='p-4'>
				<div className='flex justify-between items-start mb-2'>
					<h3 className='font-medium text-gray-900'>{task.title}</h3>
					<span
						className={`px-2 py-1 text-xs rounded-full ${
							task.priority === 'HIGH'
								? 'bg-red-100 text-red-800'
								: task.priority === 'MEDIUM'
									? 'bg-yellow-100 text-yellow-800'
									: 'bg-green-100 text-green-800'
						}`}
					>
						{task.priority === 'HIGH'
							? 'Высокий'
							: task.priority === 'MEDIUM'
								? 'Средний'
								: 'Низкий'}
					</span>
				</div>

				<div className='text-sm text-gray-500 mb-3'>
					<p>Срок: {formatDate(task.dueDate)}</p>
					<p>
						Ответственный: {task.assignedTo.surname} {task.assignedTo.name}
					</p>
					<p>Дата создания: {formatDate(task.createdAt)}</p>
				</div>

				<div className='flex justify-between items-center'>
					<span
						className={`text-xs px-2 py-1 rounded ${
							task.status === 'ACTIVE'
								? 'bg-blue-100 text-blue-800'
								: task.status === 'POSTPONED'
									? 'bg-purple-100 text-purple-800'
									: 'bg-green-100 text-green-800'
						}`}
					>
						{task.status === 'ACTIVE'
							? 'Активная'
							: task.status === 'POSTPONED'
								? 'Отложенная'
								: 'Завершенная'}
					</span>
				</div>
			</div>
		</article>
	)
}
