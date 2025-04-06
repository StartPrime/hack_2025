'use client'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { useForm } from 'react-hook-form'
import { ILoginUser } from '@/interfaces'
import { useLogin } from '@/fetch/fetchAuth'
import Loader from './loader'
import { useRouter } from 'next/navigation'

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<ILoginUser>({
		mode: 'onBlur',
	})

	const { loginUser, isLoading, isError, errorMessage } = useLogin()
	const router = useRouter()

	async function handleSubmitLogin(data: ILoginUser) {
		const res = await loginUser(data)
		console.log(res)
		if (res) {
			console.log(1)
			router.replace('/modules/articles')
		}
	}

	if (isLoading) {
		return (
			<div className='pb-6'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='w-full h-full flex flex-col'>
			<h1 className='text-2xl font-bold text-center mb-6'>Вход</h1>
			<form
				onSubmit={handleSubmit(handleSubmitLogin)}
				className='flex flex-col flex-grow justify-between px-4'
			>
				<div className='flex flex-col gap-4'>
					<label className='h-[45px]'>
						<input
							type='phone'
							placeholder='Логин'
							{...register('login', {
								required: 'Поле обязательно для заполнения',
							})}
							className={cn(
								'p-2 border-b-1 border-primary w-[100%] outline-none',
								errors?.login && 'border-red-600'
							)}
						/>
						{errors?.login && (
							<p className='text-xs text-red-600 mt-1'>
								{errors.login.message}
							</p>
						)}
					</label>
					<label className='h-[45px]'>
						<input
							type='password'
							placeholder='Пароль'
							{...register('password', {
								required: 'Поле обязательно для заполнения',
							})}
							className={cn(
								'p-2 border-b-1 border-primary w-[100%] outline-none',
								errors?.password && 'border-red-600'
							)}
						/>
						{errors?.password && (
							<p className='text-xs text-red-600 mt-1'>
								{errors.password.message}
							</p>
						)}
					</label>
				</div>
				<Button className='w-[100%] my-4' type='submit' disabled={!isValid}>
					Войти
				</Button>
				{isError && <p className='text-center text-red-600'>{errorMessage}</p>}
			</form>
		</div>
	)
}
