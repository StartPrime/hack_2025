// task.tsx
'use client'

import { useRef } from 'react'
import { ITask, Priority } from '@/interfaces'
import TaskDialog from './taskDialog'
import { formatDate } from '@/lib/utils'

interface Props {
	task: ITask
}

export default function Task({ task }: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	const priorityColors = {
		[Priority.HIGH]: 'bg-red-100 text-red-800',
		[Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
		[Priority.LOW]: 'bg-green-100 text-green-800',
	}

	return (
		<div className='relative h-full'>
			{/* Карточка задачи */}
			<div
				className='h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer'
				onClick={() => dialogRef.current?.showModal()}
			>
				{/* Заголовок и приоритет */}
				<div className='p-4 flex flex-col flex-grow'>
					<div className='flex justify-between items-start'>
						<h3 className='font-semibold text-lg mb-2 line-clamp-2'>
							{task.title}
						</h3>
						<span
							className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}
						>
							{task.priority}
						</span>
					</div>

					{/* Мета-информация */}
					<div className='mt-auto pt-3 border-t border-gray-200'>
						<div className='text-sm text-gray-500 mb-1'>
							Создана: {formatDate(task.createAt)}
						</div>
						<div className='text-sm text-gray-500 mb-1'>
							Срок: {formatDate(task.dueDate)}
						</div>
						<div className='text-sm text-gray-600'>
							<span className='text-gray-400'>Исполнитель: </span>
							{task.assignedTo.surname} {task.assignedTo.name.charAt(0)}.
						</div>
					</div>
				</div>
			</div>

			<TaskDialog dialogRef={dialogRef} taskId={task.id} />
		</div>
	)
}
