'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/fetch/apiClient'
import Container from '@/components/container'

interface IUser {
	id: string
	login: string
	firstName: string
	middleName: string
	surname: string
	role: 'ROLE_USER' | 'ROLE_ADMIN'
	registrationDate: string
}

export default function Admin() {
	const [users, setUsers] = useState<IUser[]>([])
	const [filters, setFilters] = useState({
		login: '',
		name: '',
		role: '',
		date: '',
	})
	const [editUser, setEditUser] = useState<IUser | null>(null)
	const [passwordUser, setPasswordUser] = useState<IUser | null>(null)
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [editForm, setEditForm] = useState({
		login: '',
		firstName: '',
		middleName: '',
		surname: '',
		role: 'user',
	})
	const [hasAccess, setHasAccess] = useState<boolean | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')
		setHasAccess(!!accessToken && !!refreshToken)
	}, [])

	// Загрузка пользователей
	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true)
			try {
				const users: IUser[] = await apiClient('/admin/', { method: 'GET' })
				setUsers(users)
			} catch {
				setHasAccess(false)
			} finally {
				setIsLoading(false)
			}
		}

		if (hasAccess) fetchUsers()
	}, [hasAccess])

	if (hasAccess === null || isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		)
	}

	if (!hasAccess) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'>
					<div className='text-red-500 text-3xl mb-4'>🚫</div>
					<h2 className='text-2xl font-bold text-gray-800 mb-2'>
						Доступ запрещен
					</h2>
					<p className='text-gray-600'>
						У вас нет прав для просмотра этой страницы
					</p>
				</div>
			</div>
		)
	}

	// Фильтрация пользователей
	const filteredUsers = users.filter(user => {
		const matchesLogin = user.login
			.toLowerCase()
			.includes(filters.login.toLowerCase())
		const matchesName = `${user.surname} ${user.firstName} ${user.middleName}`
			.toLowerCase()
			.includes(filters.name.toLowerCase())
		const matchesRole = filters.role ? user.role === filters.role : true
		const matchesDate = filters.date
			? new Date(user.registrationDate).toDateString() ===
				new Date(filters.date).toDateString()
			: true

		return matchesLogin && matchesName && matchesRole && matchesDate
	})

	// Обработчики изменений фильтров
	const handleFilterChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFilters(prev => ({ ...prev, [name]: value }))
	}

	// Редактирование пользователя
	const handleEdit = (user: IUser) => {
		setEditUser(user)
		setEditForm({
			login: user.login,
			firstName: user.firstName,
			middleName: user.middleName,
			surname: user.surname,
			role: user.role === 'ROLE_ADMIN' ? 'admin' : 'user',
		})
	}

	const handleEditSubmit = async () => {
		if (!editUser) return

		try {
			await apiClient('/admin/update', {
				method: 'POST',
				body: JSON.stringify({
					id: editUser.id,
					login: editForm.login,
					firstName: editForm.firstName,
					middleName: editForm.middleName,
					surname: editForm.surname,
					role: editForm.role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
				}),
			})

			// Обновляем список пользователей
			const updatedUsers: IUser[] = users.map(u =>
				u.id === editUser.id
					? {
							...u,
							...editForm,
							role: editForm.role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
						}
					: u
			)

			setUsers(updatedUsers)
			setEditUser(null)
		} catch (error) {
			console.error('Error updating user:', error)
		}
	}

	// Удаление пользователя
	const handleDelete = async (id: string) => {
		if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return

		try {
			await apiClient(`/admin/${id}`, { method: 'DELETE' })
			setUsers(users.filter(u => u.id !== id))
		} catch (error) {
			console.error('Error deleting user:', error)
		}
	}

	// Смена пароля
	const handlePasswordSubmit = async () => {
		if (!passwordUser || newPassword !== confirmPassword) return

		try {
			await apiClient(`/admin/users/${passwordUser.id}/update_password`, {
				method: 'POST',
				body: JSON.stringify({ newPassword }),
			})
			setPasswordUser(null)
			setNewPassword('')
			setConfirmPassword('')
		} catch (error) {
			console.error('Error changing password:', error)
		}
	}

	// Смена роли
	const handleRoleChange = async (userId: string, role: string) => {
		try {
			await apiClient(`/admin/users/${userId}/update_role`, {
				method: 'POST',
				body: JSON.stringify({
					role: role === 'admin' ? 'admin' : 'user',
				}),
			})

			// Обновляем список пользователей
			const updatedUsers: IUser[] = users.map(u =>
				u.id === userId
					? { ...u, role: role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER' }
					: u
			)

			setUsers(updatedUsers)
		} catch (error) {
			console.error('Error changing role:', error)
		}
	}

	// Валидация
	const validateLogin = (login: string) => /^[a-zA-Z]+$/.test(login)
	const validateName = (name: string) => /^[а-яА-ЯёЁ]+$/.test(name)
	const validatePassword = (pass: string) =>
		/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(pass)

	// Форматирование даты
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
	}

	return (
		<div className='min-h-screen py-8'>
			<Container>
				<div className='bg-white rounded-xl shadow-md overflow-hidden'>
					<div className='p-6 bg-gradient-to-r bg-primary text-white'>
						<h1 className='text-2xl font-bold'>Управление пользователями</h1>
						<p className='opacity-90'>Всего пользователей: {users.length}</p>
					</div>

					{/* Фильтры */}
					<div className='p-4 border-b'>
						<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Логин
								</label>
								<input
									type='text'
									name='login'
									placeholder='Поиск по логину'
									value={filters.login}
									onChange={handleFilterChange}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									ФИО
								</label>
								<input
									type='text'
									name='name'
									placeholder='Поиск по ФИО'
									value={filters.name}
									onChange={handleFilterChange}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 '
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Роль
								</label>
								<select
									name='role'
									value={filters.role}
									onChange={handleFilterChange}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
								>
									<option value=''>Все роли</option>
									<option value='ROLE_USER'>Пользователь</option>
									<option value='ROLE_ADMIN'>Администратор</option>
								</select>
							</div>
							<div className='flex items-end'>
								<button
									onClick={() =>
										setFilters({ login: '', name: '', role: '', date: '' })
									}
									className='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer'
								>
									Сбросить фильтры
								</button>
							</div>
						</div>
					</div>

					{/* Таблица пользователей */}
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Логин
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										ФИО
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Роль
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Дата регистрации
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Действия
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredUsers.length > 0 ? (
									filteredUsers.map((user, index) => (
										<tr
											key={index}
											className='hover:bg-gray-50 transition-colors'
										>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm font-medium text-gray-900'>
													{user.login}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{`${user.surname} ${user.firstName} ${user.middleName}`}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<select
													value={user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}
													onChange={e =>
														handleRoleChange(user.id, e.target.value)
													}
													className='text-sm text-gray-900 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
												>
													<option value='user'>Пользователь</option>
													<option value='admin'>Администратор</option>
												</select>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-500'>
													{formatDate(user.registrationDate)}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex space-x-2'>
													<button
														onClick={() => handleEdit(user)}
														className='px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm cursor-pointer'
													>
														Редактировать
													</button>
													<button
														onClick={() => {
															setPasswordUser(user)
															setNewPassword('')
															setConfirmPassword('')
														}}
														className='px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm cursor-pointer'
													>
														Пароль
													</button>
													<button
														onClick={() => handleDelete(user.id)}
														className='px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm cursor-pointer'
													>
														Удалить
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={5}
											className='px-6 py-4 text-center text-sm text-gray-500'
										>
											Пользователи не найдены
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Модальное окно редактирования */}
				{editUser && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-white rounded-lg shadow-xl w-full max-w-md'>
							<div className='p-6'>
								<h2 className='text-xl font-bold text-gray-800 mb-4'>
									Редактирование пользователя
								</h2>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Логин:
										</label>
										<input
											type='text'
											value={editForm.login}
											onChange={e =>
												setEditForm({ ...editForm, login: e.target.value })
											}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validateLogin(editForm.login) ? 'border-red-500' : 'border-gray-300'}`}
										/>
										{!validateLogin(editForm.login) && (
											<p className='mt-1 text-sm text-red-600'>
												Только латинские буквы
											</p>
										)}
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Фамилия:
										</label>
										<input
											type='text'
											value={editForm.surname}
											onChange={e =>
												setEditForm({ ...editForm, surname: e.target.value })
											}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validateName(editForm.surname) ? 'border-red-500' : 'border-gray-300'}`}
										/>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Имя:
										</label>
										<input
											type='text'
											value={editForm.firstName}
											onChange={e =>
												setEditForm({ ...editForm, firstName: e.target.value })
											}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validateName(editForm.firstName) ? 'border-red-500' : 'border-gray-300'}`}
										/>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Отчество:
										</label>
										<input
											type='text'
											value={editForm.middleName}
											onChange={e =>
												setEditForm({ ...editForm, middleName: e.target.value })
											}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validateName(editForm.middleName) ? 'border-red-500' : 'border-gray-300'}`}
										/>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Роль:
										</label>
										<select
											value={editForm.role}
											onChange={e =>
												setEditForm({ ...editForm, role: e.target.value })
											}
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
										>
											<option value='user'>Пользователь</option>
											<option value='admin'>Администратор</option>
										</select>
									</div>
								</div>
							</div>
							<div className='bg-gray-50 px-6 py-4 flex justify-end space-x-3'>
								<button
									onClick={() => setEditUser(null)}
									className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
								>
									Отмена
								</button>
								<button
									onClick={handleEditSubmit}
									className='px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors'
								>
									Сохранить
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Модальное окно смены пароля */}
				{passwordUser && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-white rounded-lg shadow-xl w-full max-w-md'>
							<div className='p-6'>
								<h2 className='text-xl font-bold text-gray-800 mb-4'>
									Смена пароля для{' '}
									<span className='text-blue-600'>{passwordUser.login}</span>
								</h2>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Новый пароль:
										</label>
										<input
											type='password'
											value={newPassword}
											onChange={e => setNewPassword(e.target.value)}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!validatePassword(newPassword) ? 'border-red-500' : 'border-gray-300'}`}
										/>
										{!validatePassword(newPassword) && (
											<p className='mt-1 text-sm text-red-600'>
												Только латинские буквы, цифры и спецсимволы
											</p>
										)}
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Подтверждение пароля:
										</label>
										<input
											type='password'
											value={confirmPassword}
											onChange={e => setConfirmPassword(e.target.value)}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
										/>
										{newPassword !== confirmPassword && (
											<p className='mt-1 text-sm text-red-600'>
												Пароли не совпадают
											</p>
										)}
									</div>
								</div>
							</div>
							<div className='bg-gray-50 px-6 py-4 flex justify-end space-x-3'>
								<button
									onClick={() => setPasswordUser(null)}
									className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
								>
									Отмена
								</button>
								<button
									onClick={handlePasswordSubmit}
									disabled={
										!newPassword ||
										newPassword !== confirmPassword ||
										!validatePassword(newPassword)
									}
									className={`px-4 py-2 text-white rounded-md transition-colors ${
										!newPassword ||
										newPassword !== confirmPassword ||
										!validatePassword(newPassword)
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-green-600 hover:bg-green-700'
									}`}
								>
									Сохранить
								</button>
							</div>
						</div>
					</div>
				)}
			</Container>
		</div>
	)
}
