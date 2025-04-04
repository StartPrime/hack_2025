'use client'

import { useRef } from 'react'
import { IArticle } from '../../interfaces'
import Article from './article'
import AddArticleDialog from './addArticleDialog'

interface Props {
	articles: IArticle[]
}

export default function ArticleContainer({ articles }: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	return (
		<div className='flex gap-[2%] flex-wrap'>
			<article className='w-[32%] flex items-center justify-center p-4 bg-white mt-4 rounded-4xl shadow '>
				<p
					className='text-2xl text-primary cursor-pointer duration-200 hover:scale-105'
					onClick={() => {
						if (dialogRef.current) {
							dialogRef.current.showModal()
						}
					}}
				>
					Добавить статью +
				</p>
			</article>
			{articles.map(article => (
				<Article key={article.id} article={article} />
			))}
			<AddArticleDialog dialogRef={dialogRef} />
		</div>
	)
}
