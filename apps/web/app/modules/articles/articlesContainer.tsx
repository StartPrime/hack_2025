'use client'

import { useRef, useState, useEffect } from 'react'
import Article from './article'
import AddArticleDialog from './addArticleDialog'
import { PlusIcon } from '@/lib/icons'
import { apiClient } from '@/fetch/apiClient'
import { IArticle } from '@/interfaces'

export default function ArticleContainer() {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [articles, setArticles] = useState<IArticle[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchArticles() {
			try {
				setLoading(true)
				const response: IArticle[] = await apiClient('/articles/', {
					method: 'GET',
				})
				if (!response) {
					throw new Error('Не удалось загрузить статьи')
				}
				setArticles(response)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Произошла ошибка')
				console.error('Ошибка при загрузке статей:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchArticles()
	}, [])

	if (loading) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex justify-center items-center h-64'>
					<p>Загрузка статей...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex justify-center items-center h-64'>
					<p className='text-red-500'>{error}</p>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			{/* Заголовок и кнопка */}
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-2xl font-bold text-gray-900'>Статьи</h1>
				<button
					onClick={() => dialogRef.current?.showModal()}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer'
				>
					<PlusIcon className='w-5 h-5' />
					<span>Добавить статью</span>
				</button>
			</div>

			{/* Сетка статей */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{articles.map(article => (
					<Article key={article.id} article={article} />
				))}
			</div>

			<dialog ref={dialogRef}>
				<AddArticleDialog dialogRef={dialogRef} />
			</dialog>
		</div>
	)
}
