'use client'

import { useRef } from 'react'
import { IArticle } from '../../interfaces'
import ArticleDialog from './articleDialog'

interface Props {
	article: IArticle
}

export default function Article({ article }: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	return (
		<article
			className='w-[32%] flex flex-col p-4 bg-white mt-4 rounded-4xl shadow cursor-pointer'
			onClick={() => {
				if (dialogRef.current) {
					dialogRef.current.showModal()
				}
			}}
		>
			<div>
				<img
					src={article.imagePath}
					alt={article.title}
					className='rounded-4xl select-none'
				/>
			</div>
			<div className='mt-2'>
				<h1 className='text-2xl'>{article.title}</h1>
				<p>Дата создания: {article.createAt}</p>
				<p>
					Последнее редактирование:{' '}
					<span>
						{article.updatedBy.surname} {article.updatedBy.name}{' '}
						{article.updatedBy.surname}
					</span>
				</p>
			</div>
			<ArticleDialog dialogRef={dialogRef} articleId={article.id} />
		</article>
	)
}
