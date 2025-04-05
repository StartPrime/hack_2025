'use client'

import { useRef } from 'react'
import { IArticle } from '@/interfaces'
import ArticleDialog from './articleDialog'
import { formatDate } from '@/lib/utils'

interface Props {
	article: IArticle
}

export default function Article({ article }: Props) {
	console.log(article)
	const dialogRef = useRef<HTMLDialogElement>(null)

	return (
		<div className='relative h-full flex flex-col'>
			{/* Карточка статьи */}
			<div
				className='h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer'
				onClick={() => dialogRef.current?.showModal()}
			>
				{/* Обложка */}
				<div className='aspect-[4/3] bg-gray-100 overflow-hidden'>
					<img
						src={article.image}
						alt={article.title}
						className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
					/>
				</div>

				{/* Контент */}
				<div className='p-4 flex flex-col flex-grow'>
					{/* Заголовок */}
					<h3 className='font-semibold text-lg mb-3 line-clamp-2'>
						{article.title}
					</h3>

					{/* Мета-информация */}
					<div className='mt-auto pt-3 border-t-1 border-gray-200'>
						<div className='text-sm text-gray-500 mb-1'>
							{formatDate(article.createAt)}
						</div>
						<div className='text-sm text-gray-600'>
							<span className='text-gray-400'>Редактор: </span>
							{article.updateBy.surname} {article.updateBy.name.charAt(0)}.
						</div>
					</div>
				</div>
			</div>

			<ArticleDialog dialogRef={dialogRef} articleId={article.id} />
		</div>
	)
}
