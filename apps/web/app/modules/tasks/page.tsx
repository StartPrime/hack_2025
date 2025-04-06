'use client'

import { useEffect, useState } from 'react'
import TasksContainer from './tasksContainer'

export default function Tasks() {
	const [hasAccess, setHasAccess] = useState<boolean | null>(null)

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')
		setHasAccess(!!accessToken && !!refreshToken)
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
			<TasksContainer />
		</>
	)
}
