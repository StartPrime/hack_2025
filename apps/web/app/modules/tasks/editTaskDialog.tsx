// editTaskDialog.tsx
'use client'

import { RefObject } from 'react'
import { ITask, IDetailedTask } from '@/interfaces'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	task: ITask & IDetailedTask
	onClose: () => void
}

export default function EditTaskDialog({ dialogRef, task, onClose }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			title: task.title,
			description: task.description,
		},
	})

	const onSubmit = (data: any) => {
		console.log('Сохранение задачи:', data)
		dialogRef.current?.close()
	}

	const handleContentChange = (content: string) => {
		setValue('description', content)
	}

	return (
		<div className='flex flex-col h-full'>
			{/* Шапка диалога */}
			<div className='sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center'>
				<h2 className='text-xl font-bold text-gray-800'>
					Редактирование задачи
				</h2>
				<button
					onClick={onClose}
					className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
					aria-label='Закрыть'
				>
					×
				</button>
			</div>

			{/* Форма редактирования */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col flex-grow p-6'
			>
				<div className='space-y-6 flex-grow'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Название задачи *
						</label>
						<input
							{...register('title', { required: true })}
							className='w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
						/>
						{errors.title && (
							<p className='text-red-500 text-sm mt-1'>Это поле обязательно</p>
						)}
					</div>

					<div className='flex-grow'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Описание
						</label>
						<Edit
							content={watch('description')}
							onChange={handleContentChange}
						/>
					</div>
				</div>

				{/* Кнопки */}
				<div className='sticky bottom-0 bg-white pt-4 flex justify-end gap-2'>
					<button
						type='button'
						onClick={onClose}
						className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded'
					>
						Отмена
					</button>
					<button
						type='submit'
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						Сохранить
					</button>
				</div>
			</form>
		</div>
	)
}
