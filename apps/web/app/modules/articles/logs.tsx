'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/fetch/apiClient'
import { IArticleLogs } from '@/interfaces'
import { Button } from '@workspace/ui/components/button'
import { RotateCcwIcon } from 'lucide-react'

const translateEventType = (eventType: string) => {
	switch (eventType) {
		case 'CREATE':
			return 'Создание'
		case 'UPDATE':
			return 'Редактирование'
		case 'DELETE':
			return 'Удаление'
		case 'RESTORE':
			return 'Восстановление'
		default:
			return eventType
	}
}

interface Props {
	setReload: () => void
}

export default function Logs({ setReload }: Props) {
	const [logs, setLogs] = useState<IArticleLogs[]>([])
	const [error, setError] = useState<string | null>(null)
	const [restoringId, setRestoringId] = useState<string | null>(null)
	const fetchLogs = async () => {
		try {
			const response = await apiClient<IArticleLogs[]>('/articles/history/')

			setLogs(
				response.sort(
					(a, b) =>
						new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
				)
			)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка загрузки логов')
		}
	}

	const handleRestore = async (articleId: string, { setReload }: Props) => {
		try {
			setRestoringId(articleId)
			await apiClient(`/articles/${articleId}/restore`, {
				method: 'POST',
			})
			await fetchLogs()
			setReload()
		} catch (err) {
			console.error('Ошибка восстановления:', err)
		} finally {
			setRestoringId(null)
		}
	}

	useEffect(() => {
		fetchLogs()
	}, [])

	if (error) {
		return (
			<div className='mb-6 p-4 bg-red-50 text-red-600 rounded-lg'>
				<p>{error}</p>
			</div>
		)
	}

	return (
		<>
			{logs.length > 0 && (
				<div className='mb-6 bg-white rounded-lg shadow overflow-hidden'>
					<div className='p-4 border-b border-gray-200 bg-gray-50'>
						<h2 className='text-lg font-semibold text-gray-900'>
							История изменений
						</h2>
					</div>
					<div className='divide-y divide-gray-200 max-h-96 overflow-y-auto'>
						{logs.length > 0 &&
							logs.map(log => (
								<div key={log.id} className='p-4 hover:bg-gray-50'>
									<div className='flex justify-between items-start gap-4'>
										<div className='flex-1 min-w-0'>
											<div className='flex items-baseline gap-2 justify-between'>
												<h3 className='font-medium truncate'>{log.title}</h3>
												<span className='text-xs text-gray-500 whitespace-nowrap flex-shrink-0'>
													{new Date(log.changedAt).toLocaleString()}
												</span>
											</div>
											<p className='text-sm text-gray-600 mt-1'>
												{translateEventType(log.eventType)}
											</p>
											<p className='text-sm text-gray-600 mt-1'>
												Изменено: {log.changedBy.surname} {log.changedBy.name}
											</p>
										</div>

										{log.eventType === 'DELETE' && log.isDeleted && (
											<div className='flex-shrink-0 ml-4'>
												<Button
													size='sm'
													variant='outline'
													onClick={() =>
														handleRestore(log.articleId, { setReload })
													}
													disabled={restoringId === log.articleId}
												>
													{restoringId === log.articleId ? (
														'Восстановление...'
													) : (
														<>
															<RotateCcwIcon className='w-4 h-4 mr-2' />
															Восстановить
														</>
													)}
												</Button>
											</div>
										)}
									</div>
								</div>
							))}
					</div>
				</div>
			)}
		</>
	)
}
