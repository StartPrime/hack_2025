'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/container'
import ArticleContainer from './articlesContainer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Articles() {
	const [hasAccess, setHasAccess] = useState<boolean | null>(null)

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')
		setHasAccess(!!accessToken || !!refreshToken)
	}, [])

	if (hasAccess === null) {
		return null
	}

	if (!hasAccess) {
		return (
			<div className='text-2xl text-red-600 mt-12 text-center'>
				Отказано в доступе...
			</div>
		)
	}

	return (
		<>
			<ToastContainer />
			<main className='my-8'>
				<Container>
					<section>
						<ArticleContainer />
					</section>
				</Container>
			</main>
		</>
	)
}
