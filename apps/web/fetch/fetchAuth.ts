import { useState } from 'react'
import { ILoginUser, IRegisterUser } from '@/interfaces'

const BASE_URL = 'https://hack2025.feryafox.ru/api'
// const BASE_URL = 'http://127.0.0.1:8080'

export const useRegister = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const registerUser = async (data: IRegisterUser) => {
		setIsLoading(true)
		setIsError(false)
		setErrorMessage(null)

		try {
			const userData = { ...data, role: 'BUYER' }
			const response = await fetch(BASE_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify(userData),
			})

			if (!response.ok) {
				const message =
					response.status === 409
						? 'Пользователь уже существует'
						: 'Ошибка регистрации'
				throw new Error(message)
			}
			return true
		} catch (error) {
			setIsError(true)
			setErrorMessage(
				error instanceof Error ? error.message : 'Неизвестная ошибка'
			)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	return { registerUser, isLoading, isError, errorMessage }
}

export const useLogin = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const loginUser = async (data: ILoginUser) => {
		setIsLoading(true)
		setIsError(false)
		setErrorMessage(null)

		try {
			const success = await fetch(BASE_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify(data),
				credentials: 'include',
			})

			if (!success.ok) {
				const message =
					success.status === 401
						? 'Неверный логин или пароль'
						: 'Ошибка авторизации'
				throw new Error(message)
			}

			const { accessToken, refreshToken } = await success.json()
			localStorage.setItem('accessToken', accessToken)
			localStorage.setItem('refreshToken', refreshToken)
			return true
		} catch (error) {
			setIsError(true)
			setErrorMessage(
				error instanceof Error ? error.message : 'Неизвестная ошибка'
			)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	return { loginUser, isLoading, isError, errorMessage }
}
