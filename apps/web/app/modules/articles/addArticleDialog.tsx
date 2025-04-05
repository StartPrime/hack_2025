'use client'

import { RefObject, useState } from 'react'
import { useForm } from 'react-hook-form'
import Edit from '@/lib/edit'
import { CloseIcon, UploadIcon } from '@/lib/icons'
import { IDetailedArticle } from '@/interfaces'
import { apiClient } from '@/fetch/apiClient'

interface IArticleForm {
	title: string
	content: string
	image?: FileList
}

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	article?: IDetailedArticle
	setReload: () => void
}

export default function AddArticleDialog({
	dialogRef,
	article,
	setReload,
}: Props) {
	const isEditMode = !!article

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
			title: article?.title || '',
			content: article?.content || '',
		},
	})

	const [fileInputLabel, setFileInputLabel] = useState(
		isEditMode ? article.image : 'Выберите файл'
	)
	const imagePreview = watch('image')?.[0]
	const previewUrl = imagePreview
		? URL.createObjectURL(imagePreview)
		: isEditMode
			? article.image
			: null

	const onSubmit = async (data: IArticleForm) => {
		const pushData = { title: data.title, content: data.content }

		try {
			if (!isEditMode) {
				// Создаем статью (JSON)
				const resOne = await apiClient<{ id: string }>('/articles/', {
					method: 'POST',
					body: JSON.stringify(pushData),
				})

				// Загружаем изображение (FormData)
				if (resOne && data.image?.[0]) {
					const formData = new FormData()
					formData.append('image', data.image[0])

					await apiClient(`/articles/${resOne.id}/upload_image`, {
						method: 'POST',
						body: formData,
					})
				}
			} else {
				const resOne = await apiClient(`/articles/${article.id}`, {
					method: 'PUT',
					body: JSON.stringify({ title: data.title, content: data.content }),
				})
				console.log(resOne, data.image?.[0])
				if (data.image?.[0]) {
					const formData = new FormData()
					formData.append('image', data.image[0])

					await apiClient(`/articles/${article.id}/upload_image`, {
						method: 'POST',
						body: formData,
					})
				}
			}
			setReload()
		} catch (e) {
			console.error('Error submitting article:', e)
		} finally {
			if (!isEditMode) reset()
			dialogRef.current?.close()
		}
	}

	const handleClose = () => {
		if (!isEditMode) {
			reset()
		}
		dialogRef.current?.close()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFileInputLabel(e.target.files[0].name)
		} else {
			setFileInputLabel(isEditMode ? article.image : 'Выберите файл')
		}
	}

	const handleContentChange = (content: string) => {
		setValue('content', content, { shouldValidate: true })
	}

	return (
		<div className='fixed inset-0 m-auto p-0 rounded-xl shadow-2xl backdrop:bg-black/50 w-full max-w-3xl max-h-[95vh] bg-white animate-fade-in overflow-auto'>
			<div className='relative'>
				{/* Заголовок и кнопка закрытия */}
				<div className='sticky top-0 z-10 bg-white p-6 pb-4 border-b flex justify-between items-start'>
					<h2 className='text-2xl font-bold text-gray-800'>
						{isEditMode ? 'Редактирование статьи' : 'Новая статья'}
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
					{/* Блок обложки */}
					<div className='space-y-4'>
						<label className='block text-sm font-medium text-gray-700'>
							Обложка статьи
						</label>
						<div className='flex items-center gap-4'>
							<label className='flex-1 cursor-pointer'>
								<div className='relative group'>
									<div className='aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors duration-200 flex items-center justify-center'>
										{previewUrl ? (
											<img
												src={previewUrl}
												alt='Preview'
												className='w-auto h-full object-contain rounded-lg'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center text-gray-400'>
												<UploadIcon className='w-10 h-10' />
											</div>
										)}
									</div>
									<input
										type='file'
										accept='image/*'
										className='absolute inset-0 opacity-0 cursor-pointer'
										{...register('image', {
											onChange: handleFileChange,
										})}
									/>
								</div>
							</label>
							<div className='flex-1 space-y-2'>
								<p className='text-sm text-gray-500'>
									{imagePreview?.name || fileInputLabel}
								</p>
								<p className='text-xs text-gray-400'>
									Рекомендуемый размер: 1200×630px
								</p>
							</div>
						</div>
					</div>

					{/* Поле названия */}
					<div className='space-y-2'>
						<label
							htmlFor='title'
							className='block text-sm font-medium text-gray-700'
						>
							Название статьи *
						</label>
						<input
							id='title'
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

					{/* Редактор контента */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium text-gray-700'>
							Содержание статьи
						</label>
						<div className='border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
							<Edit content={watch('content')} onChange={handleContentChange} />
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
							{isEditMode ? 'Сохранить' : 'Опубликовать'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
