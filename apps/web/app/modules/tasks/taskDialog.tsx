'use client'

import { RefObject, useState } from 'react'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'
import { CloseIcon } from '@/lib/icons'
import { IDetailedTask, Priority, TaskStatus } from '@/interfaces'

interface ITaskForm {
	title: string
	description: string
	dueDate: string
	priority: Priority
	status: TaskStatus
	assignedTo: string
}

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	task?: IDetailedTask
	teamMembers: Array<{ id: string; name: string; surname: string }>
}

export default function TaskDialog({ dialogRef, task, teamMembers }: Props) {
	const isEditMode = !!task

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
		setValue,
	} = useForm<ITaskForm>({
		mode: 'onBlur',
		defaultValues: {
			title: task?.title || '',
			description: task?.description || '',
			dueDate: task?.dueDate || '',
			priority: task?.priority || Priority.MEDIUM,
			status: task?.status || TaskStatus.ACTIVE,
			assignedTo: task?.assignedTo.id || '',
		},
	})

	const onSubmit = (data: ITaskForm) => {
		console.log('Данные формы:', data)
		dialogRef.current?.close()
	}

	const handleClose = () => {
		if (!isEditMode) {
			reset()
		}
		dialogRef.current?.close()
	}

	const handleContentChange = (content: string) => {
		setValue('description', content, { shouldValidate: true })
	}

	return (
		<div className='fixed inset-0 m-auto p-0 rounded-xl shadow-2xl backdrop:bg-black/50 w-full max-w-3xl max-h-[95vh] bg-white animate-fade-in overflow-auto'>
			<div className='relative'>
				{/* Заголовок и кнопка закрытия */}
				<div className='sticky top-0 z-10 bg-white p-6 pb-4 border-b flex justify-between items-start'>
					<h2 className='text-2xl font-bold text-gray-800'>
						{isEditMode ? 'Редактирование задачи' : 'Новая задача'}
					</h2>
					<button
						onClick={handleClose}
						className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
						aria-label='Закрыть'
					>
						<CloseIcon className='w-6 h-6' />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-6'>
					{/* Основные поля */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Поле названия */}
						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-700'>
								Название задачи *
							</label>
							<input
								type='text'
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
									errors.title ? 'border-red-500' : 'border-gray-300'
								}`}
								{...register('title', { required: 'Это поле обязательно' })}
							/>
							{errors.title && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.title.message}
								</p>
							)}
						</div>

						{/* Поле исполнителя */}
						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-700'>
								Исполнитель *
							</label>
							<select
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
								{...register('assignedTo', { required: true })}
							>
								{teamMembers.map(member => (
									<option key={member.id} value={member.id}>
										{member.surname} {member.name}
									</option>
								))}
							</select>
						</div>

						{/* Поле даты */}
						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-700'>
								Срок выполнения *
							</label>
							<input
								type='date'
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
								{...register('dueDate', { required: true })}
							/>
						</div>

						{/* Поле приоритета */}
						<div className='space-y-2'>
							<label className='block text-sm font-medium text-gray-700'>
								Приоритет *
							</label>
							<select
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
								{...register('priority', { required: true })}
							>
								<option value={Priority.HIGH}>Высокий</option>
								<option value={Priority.MEDIUM}>Средний</option>
								<option value={Priority.LOW}>Низкий</option>
							</select>
						</div>
					</div>

					{/* Редактор описания */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium text-gray-700'>
							Описание задачи
						</label>
						<div className='border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
							<Edit
								content={watch('description')}
								onChange={handleContentChange}
							/>
						</div>
					</div>

					{/* Кнопки действий */}
					<div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
						<button
							type='button'
							onClick={handleClose}
							className='px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
						>
							Отмена
						</button>
						<button
							type='submit'
							className={`px-6 py-2 text-white rounded-lg transition-colors cursor-pointer ${
								isValid
									? 'bg-blue-600 hover:bg-blue-700'
									: 'bg-gray-400 cursor-not-allowed'
							}`}
							disabled={!isValid}
						>
							{isEditMode ? 'Сохранить изменения' : 'Создать задачу'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
