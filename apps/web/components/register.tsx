'use client'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { useForm } from 'react-hook-form'
import { IRegisterUser } from '@/interfaces'
import { useRegister, useLogin } from '@/fetch/fetchAuth'
import Loader from './loader'

interface IRegisterData extends IRegisterUser {
	repeatPassword: string
}

export default function Register() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<IRegisterData>({
		mode: 'onBlur',
	})
	const password = watch('password')

	const { registerUser, isLoading, isError, errorMessage } = useRegister()
	const { loginUser } = useLogin()

	async function handleSubmitRegister(data: IRegisterData) {
		const { repeatPassword, ...userData } = data
		const resRegister = await registerUser(userData)
		if (resRegister) {
			const { login, password, ...otherData } = data
			const resLogin = await loginUser({ login, password })
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
		<>
			<div className='w-full h-full flex flex-col'>
				<h1 className='text-2xl font-bold text-center mb-6'>Регистрация</h1>
				<form
					onSubmit={handleSubmit(handleSubmitRegister)}
					className='flex flex-col flex-grow justify-between px-4'
				>
					<div className='flex flex-col gap-4'>
						<label className='h-[45px]'>
							<input
								type='text'
								placeholder='Имя'
								{...register('firstName', {
									required: 'Поле обязательно для заполнения',
									pattern: {
										value: /^[А-Яа-яЁё\s]+$/,
										message: 'Допустимы только русские буквы',
									},
								})}
								className={cn(
									'p-2 border-b-1 border-primary w-[100%] outline-none',
									errors?.firstName && 'border-red-600'
								)}
							/>
							{errors?.firstName && (
								<p className='text-xs text-red-600 mt-1'>
									{errors.firstName.message}
								</p>
							)}
						</label>
						<label className='h-[45px]'>
							<input
								type='text'
								placeholder='Фамилия'
								{...register('surname', {
									required: 'Поле обязательно для заполнения',
									pattern: {
										value: /^[А-Яа-яЁё\s]+$/,
										message: 'Допустимы только русские буквы',
									},
								})}
								className={cn(
									'p-2 border-b-1 border-primary w-[100%] outline-none',
									errors?.surname && 'border-red-600'
								)}
							/>
							{errors?.surname && (
								<p className='text-xs text-red-600 mt-1'>
									{errors.surname.message}
								</p>
							)}
						</label>
						<label className='h-[45px]'>
							<input
								type='text'
								placeholder='Отчество'
								{...register('middleName', {
									required: 'Поле обязательно для заполнения',
									pattern: {
										value: /^[А-Яа-яЁё\s]+$/,
										message: 'Допустимы только русские буквы',
									},
								})}
								className={cn(
									'p-2 border-b-1 border-primary w-[100%] outline-none',
									errors?.middleName && 'border-red-600'
								)}
							/>
							{errors?.middleName && (
								<p className='text-xs text-red-600 mt-1'>
									{errors.middleName.message}
								</p>
							)}
						</label>
						<label className='h-[45px]'>
							<input
								type='text'
								placeholder='Логин'
								{...register('login', {
									required: 'Поле обязательно для заполнения',
									pattern: {
										value: /^[a-zA-Z]+$/,
										message: 'Допустимы только латинские буквы',
									},
									minLength: {
										value: 3,
										message: 'Минимальная длина 3 символа',
									},
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
									minLength: {
										value: 8,
										message: 'Минимальная длина 8 символов',
									},
									pattern: {
										value: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
										message:
											'Допустимы только латинские буквы, цифры и специальные символы',
									},
								})}
								className={cn(
									'p-2 border-b-1 border-primary w-[100%] outline-none',
									errors?.password && 'border-red-600'
								)}
							/>
							{errors?.password && (
								<p className='text-xs text-red-600 mt-1	'>
									{errors.password.message}
								</p>
							)}
						</label>
						<label
							className={cn(
								'h-[45px]',
								errors.password?.type === 'pattern' && 'mt-4'
							)}
						>
							<input
								type='password'
								placeholder='Повторите пароль'
								{...register('repeatPassword', {
									required: 'Поле обязательно для заполнения',
									validate: value =>
										value === password || 'Пароли не совпадают',
								})}
								className={cn(
									'p-2 border-b-1 border-primary w-[100%] outline-none',
									errors?.repeatPassword && 'border-red-600'
								)}
							/>
							{errors?.repeatPassword && (
								<p className='text-xs text-red-600 mt-1'>
									{errors.repeatPassword.message}
								</p>
							)}
						</label>
					</div>
					<Button type='submit' className='w-[100%] my-4' disabled={!isValid}>
						Войти
					</Button>
					{isError && (
						<p className='text-center text-red-600'>{errorMessage}</p>
					)}
				</form>
			</div>
		</>
	)
}
