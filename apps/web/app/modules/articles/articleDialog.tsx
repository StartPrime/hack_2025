'use client'

import { RefObject, useEffect, useRef, useState } from 'react'
import { IDetailedArticle } from '@/interfaces'
import { Button } from '@workspace/ui/components/button'
import AddArticleDialog from './addArticleDialog'
import { apiClient } from '@/fetch/apiClient'
import { toast } from 'react-toastify'

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	articleId: number
	setReload: () => void
}

const testArticle: IDetailedArticle = {
	id: 5,
	image: '/i.webp',
	title: 'Лучшие практики работы с Git',
	createdAt: '04.04.2025',
	content: `
    <p>В этой статье рассмотрим основные лучшие практики работы с системой контроля версий Git.</p>
    <h2>Основные команды</h2>
    <ul>
      <li><code>git commit</code> - создание коммита</li>
      <li><code>git push</code> - отправка изменений на сервер</li>
      <li><code>git pull</code> - получение изменений с сервера</li>
    </ul>
    <h2>Рекомендации</h2>
    <p>Всегда пишите осмысленные сообщения коммитов.</p>
  `,
	updatedBy: {
		name: 'Сергей',
		surname: 'Иванов',
		middleName: 'Петрович',
	},
	createdBy: {
		name: 'Андрей',
		surname: 'Горькавой',
		middleName: 'Александрович',
	},
}

export default function ArticleDialog({
	dialogRef,
	articleId,
	setReload,
}: Props) {
	const [isEdit, setIsEdit] = useState(false)
	const [article, setArticle] = useState<IDetailedArticle | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchArticle = async () => {
		try {
			setIsLoading(true)
			setError(null)
			const data = await apiClient<IDetailedArticle>(`/articles/${articleId}`, {
				method: 'GET',
			})
			setArticle(data)
		} catch (err) {
			console.error('Ошибка при загрузке статьи:', err)
			setError('Не удалось загрузить статью')
			// В случае ошибки используем тестовые данные
			setArticle(testArticle)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async () => {
		try {
			await apiClient(`/articles/${articleId}`, {
				method: 'DELETE',
			})

			dialogRef.current?.close()
			setReload()
			toast.success('Статью можно восстановить в течение 7 дней')
		} catch (err) {
			console.error('Ошибка при удалении статьи:', err)
		}
	}

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) return

		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.attributeName === 'open') {
					if (dialog.open) {
						fetchArticle()
					} else {
						setIsEdit(false)
					}
				}
			})
		})

		observer.observe(dialog, { attributes: true })

		return () => {
			observer.disconnect()
		}
	}, [articleId])

	if (isLoading && !article) {
		return (
			<dialog
				ref={dialogRef}
				className='fixed inset-0 m-auto p-0 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm overflow-auto animate-fade-in'
			>
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			</dialog>
		)
	}

	if (error && !article) {
		return (
			<dialog
				ref={dialogRef}
				className='fixed inset-0 m-auto p-0 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm overflow-auto animate-fade-in'
			>
				<div className='p-6 text-center'>
					<p className='text-red-500'>{error}</p>
					<button
						onClick={() => dialogRef.current?.close()}
						className='mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer'
					>
						Закрыть
					</button>
				</div>
			</dialog>
		)
	}

	const currentArticle = article || testArticle

	return (
		<dialog
			ref={dialogRef}
			className='fixed inset-0 m-auto p-0 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm overflow-auto animate-fade-in'
		>
			{!isEdit ? (
				<div className='flex flex-col'>
					{/* Шапка диалога */}
					<div className='sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center'>
						<h2 className='text-xl font-bold text-gray-800'>Просмотр статьи</h2>
						<button
							onClick={() => dialogRef.current?.close()}
							className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
							aria-label='Закрыть'
						>
							<svg
								className='w-6 h-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>

					{/* Основное содержимое с прокруткой */}
					<div className='overflow-y-auto p-6'>
						{/* Обложка статьи */}
						<div className='mb-6 rounded-lg overflow-hidden'>
							<img
								src={currentArticle.image}
								alt={currentArticle.title}
								className='w-full h-auto max-h-96 object-cover'
							/>
						</div>

						{/* Заголовок и мета-информация */}
						<div className='mb-8'>
							<div className='flex justify-between'>
								<h1 className='sm:text-3xl text-[20px] font-bold text-gray-900 mb-4'>
									{currentArticle.title}
								</h1>
								<Button
									onClick={() => {
										setIsEdit(true)
									}}
								>
									Редактировать
								</Button>
							</div>

							<div className='flex flex-wrap gap-4 text-sm text-gray-600 mb-6'>
								<div className='flex items-center gap-2'>
									<svg
										className='w-4 h-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
									<span>Создано: {currentArticle.createdAt}</span>
								</div>
								<div className='flex items-center gap-2'>
									<svg
										className='w-4 h-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
									<span>
										Редактор: {currentArticle.updatedBy.surname}{' '}
										{currentArticle.updatedBy.name.charAt(0)}.
									</span>
								</div>
							</div>
						</div>

						{/* Контент статьи */}
						<div
							className='prose max-w-none'
							dangerouslySetInnerHTML={{ __html: currentArticle.content }}
						/>

						{/* Автор статьи */}
						<div className='mt-8 py-3 border-y-2 border-gray-200'>
							<h3 className='text-sm font-medium text-gray-500 mb-2'>
								Автор статьи
							</h3>
							<p className='text-gray-700'>
								{currentArticle.createdBy.surname}{' '}
								{currentArticle.createdBy.name}{' '}
								{currentArticle.createdBy.middleName}
							</p>
						</div>
					</div>

					{/* Подвал диалога */}
					<div className='sticky bottom-0 bg-white p-4 flex justify-end gap-3'>
						<button
							onClick={handleDelete}
							className='px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2'
						>
							<svg
								className='w-5 h-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
								/>
							</svg>
							Удалить
						</button>
						<button
							onClick={() => dialogRef.current?.close()}
							className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer'
						>
							Закрыть
						</button>
					</div>
				</div>
			) : (
				<AddArticleDialog
					dialogRef={dialogRef}
					article={currentArticle}
					setReload={setReload}
				/>
			)}
		</dialog>
	)
}
