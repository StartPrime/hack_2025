const BASE_URL = 'http://127.0.0.1:8080'

interface RequestOptions extends RequestInit {
	headers?: Record<string, string>
	noAuth?: boolean // Если true, не добавляет токен
}

export async function apiClient<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	const normalizedEndpoint = endpoint.startsWith('/')
		? endpoint.slice(1)
		: endpoint
	const url = `${BASE_URL}/${normalizedEndpoint}`

	const accessToken = localStorage.getItem('accessToken')
	const headers: Record<string, string> = {
		...options.headers,
	}

	// Добавляем токен, если он есть и не отключен noAuth
	if (accessToken && !options.noAuth) {
		headers['Authorization'] = `Bearer ${accessToken}`
	}

	// Не устанавливаем Content-Type для FormData
	if (!(options.body instanceof FormData)) {
		headers['Content-Type'] = 'application/json'
	}

	const config: RequestInit = {
		...options,
		headers,
		credentials: 'include', // Добавляем credentials для куков
	}

	try {
		const response = await fetch(url, config)

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			throw new Error(errorData?.message || 'Request failed')
		}

		// Для ответов без тела (например, 204 No Content)
		if (response.status === 204) {
			return undefined as unknown as T
		}

		return response.json() as Promise<T>
	} catch (error) {
		console.error('API Client Error:', error)
		throw error
	}
}
