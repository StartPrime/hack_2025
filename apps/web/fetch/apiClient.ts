const BASE_URL = 'http://test.feryafox.ru/api'

interface RequestOptions extends RequestInit {
	headers?: Record<string, string>
	noAuth?: boolean // Если true, не добавляет токен
}

export async function apiClient<T>(
	endpoint: string,
	options: RequestOptions = {}
): Promise<T> {
	// Убираем слеш в начале endpoint, если он есть (чтобы избежать дублирования)
	const normalizedEndpoint = endpoint.startsWith('/')
		? endpoint.slice(1)
		: endpoint
	const url = `${BASE_URL}/${normalizedEndpoint}`

	const accessToken = localStorage.getItem('accessToken')
	// Стандартные заголовки
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...options.headers,
	}

	// Добавляем токен, если он есть и не отключен noAuth
	if (accessToken && !options.noAuth) {
		headers['Authorization'] = `Bearer ${accessToken}`
	}

	const config: RequestInit = {
		...options,
		headers,
	}

	try {
		const response = await fetch(url, config)

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			throw new Error(errorData?.message || 'Request failed')
		}

		return response.json() as Promise<T>
	} catch (error) {
		throw error
	}
}
