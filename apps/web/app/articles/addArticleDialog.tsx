'use client'

import { RefObject, useState } from 'react'
import { useForm } from 'react-hook-form'
import Edit from './edit'

interface IArticleForm {
	title: string
	content: string
	image?: FileList
}

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
}

export default function AddArticleDialog({ dialogRef }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
		setValue,
	} = useForm<IArticleForm>({
		mode: 'onBlur',
		defaultValues: {
			title: '',
			content: '',
		},
	})

	const [fileInputLabel, setFileInputLabel] = useState('Выберите файл')
	const imagePreview = watch('image')?.[0]
	const previewUrl = imagePreview ? URL.createObjectURL(imagePreview) : null

	const onSubmit = (data: IArticleForm) => {
		console.log('Данные формы:', {
			title: data.title,
			content: data.content,
			image: data.image?.[0]?.name || 'Не выбрано',
		})
		reset()
		dialogRef.current?.close()
	}

	const handleClose = () => {
		reset()
		dialogRef.current?.close()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFileInputLabel(e.target.files[0].name)
		} else {
			setFileInputLabel('Выберите файл')
		}
	}

	const handleContentChange = (content: string) => {
		setValue('content', content, { shouldValidate: true })
	}

	return (
		<dialog
			ref={dialogRef}
			className='fixed inset-0 m-auto p-6 rounded-4xl shadow-xl backdrop:bg-black/50 w-full max-w-2xl'
		>
			<div className='space-y-4'>
				<h2 className='text-2xl font-bold text-primary'>
					Добавить новую статью
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='w-full flex flex-col items-center justify-center gap-4'>
						<div className='w-full'>
							<label htmlFor='image' className='block mb-1 font-medium'>
								Обложка статьи
							</label>
							<div className='relative'>
								<input
									id='image'
									type='file'
									accept='image/*'
									className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
									{...register('image', {
										onChange: handleFileChange,
									})}
								/>
								<div className='flex items-center justify-between p-2 border rounded gap-2'>
									<span className='text-gray-500'>{fileInputLabel}</span>
									<button
										type='button'
										className='px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200'
										onClick={e => {
											e.preventDefault()
											document.getElementById('image')?.click()
										}}
									>
										Обзор
									</button>
								</div>
							</div>
							{!imagePreview && (
								<p className='mt-1 text-sm text-gray-500'>Файл не выбран</p>
							)}
							{imagePreview && previewUrl && (
								<div className='mt-4'>
									<img
										src={previewUrl}
										alt='Preview'
										className='max-h-40 rounded object-cover mx-auto'
									/>
								</div>
							)}
						</div>

						<div className='w-full'>
							<label
								htmlFor='title'
								className='block mb-1 font-medium text-primary'
							>
								Название статьи*
							</label>
							<input
								id='title'
								type='text'
								className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
								{...register('title', { required: 'Это поле обязательно' })}
							/>
							{errors.title && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.title.message}
								</p>
							)}
						</div>
					</div>

					<div className='w-full'>
						<label className='block mb-1 font-medium text-primary'>
							Содержание статьи
						</label>
						<div className='border rounded p-2 min-h-[300px]'>
							<Edit content={watch('content')} onChange={handleContentChange} />
						</div>
					</div>

					<div className='flex justify-end space-x-3 pt-4'>
						<button
							type='button'
							onClick={handleClose}
							className='px-4 py-2 border rounded hover:bg-gray-100'
						>
							Отмена
						</button>
						<button
							type='submit'
							className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
							disabled={!isValid}
						>
							Сохранить
						</button>
					</div>
				</form>
			</div>
		</dialog>
	)
}
