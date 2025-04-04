'use client'

import { RefObject, useEffect, useState } from 'react'
import { IDetailedArticle } from '@/interfaces'

interface Props {
	dialogRef: RefObject<HTMLDialogElement | null>
	articleId: number
}

export default function ArticleDialog({ dialogRef, articleId }: Props) {
	const [article, setArticle] = useState<IDetailedArticle | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) return

		const handleOpen = async () => {
			setIsLoading(true)
			try {
				console.log(1)
			} catch (error) {
				console.error('Ошибка загрузки статьи:', error)
			} finally {
				setIsLoading(false)
			}
		}

		dialog.addEventListener('open', handleOpen)

		return () => {
			dialog.removeEventListener('open', handleOpen)
		}
	}, [dialogRef, articleId])

	return (
		<dialog ref={dialogRef} className='p-6 rounded-lg shadow-xl'>
			{isLoading ? (
				<p>Загрузка...</p>
			) : article ? (
				<div>
					<h2 className='text-2xl font-bold'>{article.title}</h2>
					<p>{article.content}</p>
				</div>
			) : (
				<p>Не удалось загрузить статью</p>
			)}
		</dialog>
	)
}
