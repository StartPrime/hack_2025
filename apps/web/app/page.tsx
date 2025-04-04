'use client'

import { cn } from '@workspace/ui/lib/utils'
import Register from '../components/register'
import Login from '../components/login'
import { useStateAuth } from '../store/auth'

export default function Page() {
	const page = useStateAuth(state => state.active)
	const setPage = useStateAuth(state => state.setStateAuth)

	return (
		<div className='min-h-[100vh] flex flex-col justify-center items-center'>
			<button
				onClick={() => {
					const res = fetch('http://127.0.0.1:8080/cookie-test/set', {
						method: 'GET',
						credentials: 'include',
					})
					console.log(res)
				}}
			>
				qwe
			</button>
			<div className='border bg-card rounded flex flex-col items-center shadow h-max w-80'>
				<div className='flex items-start w-[100%] gap-4 text-primary mb-8 p-4'>
					<p
						className={cn(
							page && 'border-b-1 border-primary',
							'duration-200 cursor-pointer'
						)}
						onClick={() => setPage()}
					>
						Вход
					</p>
					<p
						className={cn(
							!page && 'border-b-1 border-primary',
							'duration-200 cursor-pointer'
						)}
						onClick={() => setPage()}
					>
						Регистрация
					</p>
				</div>
				{page ? <Login /> : <Register />}
			</div>
		</div>
	)
}
