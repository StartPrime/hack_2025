// components/task.tsx
'use client'

import { ITask, TaskStatus, Priority } from '@/interfaces'
import { formatDate } from '@/lib/utils'
import { cn } from '@workspace/ui/lib/utils'
import { useRef } from 'react'
import EditTaskDialog from './taskDialog'

interface Props {
	task: ITask
	currentStatus: TaskStatus
	onEdit?: (task: ITask) => void
	onDelete?: (id: number) => void
	onChangeStatus?: (id: number, status: TaskStatus) => void
}

const priorityColors = {
	[Priority.HIGH]: 'bg-red-100 text-red-800',
	[Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
	[Priority.LOW]: 'bg-green-100 text-green-800',
}

const statusColors = {
	[TaskStatus.ACTIVE]: 'bg-blue-100 text-blue-800',
	[TaskStatus.POSTPONED]: 'bg-purple-100 text-purple-800',
	[TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
}

export default function Task({ task }: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	return (
		<>
			<article
				className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer'
				onClick={() => {
					dialogRef.current?.showModal()
				}}
			>
				{/* Остальное содержимое карточки задачи без изменений */}
				<div className='flex justify-between items-start gap-2'>
					<h3 className='text-lg font-medium text-gray-900 flex-1'>
						{task.title}
					</h3>
					<div className='flex flex-col items-end gap-1'>
						<span
							className={cn(
								'text-xs font-medium px-2 py-1 rounded-full',
								priorityColors[task.priority]
							)}
						>
							{task.priority}
						</span>
						<span
							className={cn(
								'text-xs font-medium px-2 py-1 rounded-full',
								statusColors[task.status]
							)}
						>
							{task.status === TaskStatus.ACTIVE && 'Активна'}
							{task.status === TaskStatus.POSTPONED && 'Отложена'}
							{task.status === TaskStatus.COMPLETED && 'Выполнена'}
						</span>
					</div>
				</div>

				<div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
					<div>
						<p className='text-gray-500'>Создана:</p>
						<p>{formatDate(task.createAt)}</p>
					</div>
					<div>
						<p className='text-gray-500'>Срок:</p>
						<p
							className={cn(
								task.status === TaskStatus.COMPLETED
									? 'text-green-600'
									: new Date(task.dueDate) < new Date()
										? 'text-red-600'
										: 'text-gray-900'
							)}
						>
							{formatDate(task.dueDate)}
						</p>
					</div>
					<div className='col-span-2'>
						<p className='text-gray-500'>Ответственный:</p>
						<p>{`${task.assignedTo.surname} ${task.assignedTo.name.charAt(0)}.${task.assignedTo.middleName.charAt(0)}.`}</p>
					</div>
				</div>
				<dialog
					ref={dialogRef}
					className='p-0 w-full max-w-2xl rounded-xl backdrop:bg-black/50 m-auto'
				>
					<EditTaskDialog dialogRef={dialogRef} taskId={task.id} />
				</dialog>
			</article>
		</>
	)
}
