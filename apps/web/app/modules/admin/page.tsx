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

	// Загрузка пользователей
	useEffect(() => {
		const response = async () => {
			const users: IUser[] = await apiClient('/admin/', { method: 'GET' })
			setUsers(users)
		}

		response()
	}, [])

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
		<div className='mt-12'>
			<Container>
				<h1 className='text-2xl font-bold mb-6'>Управление пользователями</h1>
				{/* Панель фильтрации */}
				<div className='flex flex-wrap gap-4 mb-6'>
					<input
						type='text'
						name='login'
						placeholder='Поиск по логину'
						value={filters.login}
						onChange={handleFilterChange}
						className='px-4 py-2 border rounded'
					/>
					<input
						type='text'
						name='name'
						placeholder='Поиск по ФИО'
						value={filters.name}
						onChange={handleFilterChange}
						className='px-4 py-2 border rounded'
					/>
					<select
						name='role'
						value={filters.role}
						onChange={handleFilterChange}
						className='px-4 py-2 border rounded'
					>
						<option value=''>Все роли</option>
						<option value='ROLE_USER'>Пользователь</option>
						<option value='ROLE_ADMIN'>Администратор</option>
					</select>
					<input
						type='date'
						name='date'
						value={filters.date}
						onChange={handleFilterChange}
						className='px-4 py-2 border rounded'
					/>
					<button
						onClick={() =>
							setFilters({ login: '', name: '', role: '', date: '' })
						}
						className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
					>
						Сбросить
					</button>
				</div>
				{/* Таблица пользователей */}
				<div className='overflow-x-auto'>
					<table className='min-w-full border'>
						<thead>
							<tr className='bg-gray-100'>
								<th className='border px-4 py-2 text-left'>Логин</th>
								<th className='border px-4 py-2 text-left'>ФИО</th>
								<th className='border px-4 py-2 text-left'>Роль</th>
								<th className='border px-4 py-2 text-left'>Дата регистрации</th>
								<th className='border px-4 py-2 text-left'>Действия</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user, index) => (
								<tr key={index} className='hover:bg-gray-50'>
									<td className='border px-4 py-2'>{user.login}</td>
									<td className='border px-4 py-2'>{`${user.surname} ${user.firstName} ${user.middleName}`}</td>
									<td className='border px-4 py-2'>
										<select
											value={user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}
											onChange={e => handleRoleChange(user.id, e.target.value)}
											className='w-full px-2 py-1 border rounded'
										>
											<option value='user'>Пользователь</option>
											<option value='admin'>Администратор</option>
										</select>
									</td>
									<td className='border px-4 py-2'>
										{formatDate(user.registrationDate)}
									</td>
									<td className='border px-4 py-2'>
										<div className='flex gap-2'>
											<button
												onClick={() => handleEdit(user)}
												className='px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200'
											>
												Редактировать
											</button>
											<button
												onClick={() => {
													setPasswordUser(user)
													setNewPassword('')
													setConfirmPassword('')
												}}
												className='px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200'
											>
												Пароль
											</button>
											<button
												onClick={() => handleDelete(user.id)}
												className='px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200'
											>
												Удалить
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Модальное окно редактирования */}
				{editUser && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-white rounded-lg p-6 w-full max-w-md'>
							<h2 className='text-xl font-bold mb-4'>
								Редактирование пользователя
							</h2>
							<div className='space-y-4'>
								<div>
									<label className='block mb-1'>Логин:</label>
									<input
										type='text'
										value={editForm.login}
										onChange={e =>
											setEditForm({ ...editForm, login: e.target.value })
										}
										className={`w-full px-3 py-2 border rounded ${!validateLogin(editForm.login) ? 'border-red-500' : ''}`}
									/>
									{!validateLogin(editForm.login) && (
										<p className='text-red-500 text-sm mt-1'>
											Только латинские буквы
										</p>
									)}
								</div>
								<div>
									<label className='block mb-1'>Фамилия:</label>
									<input
										type='text'
										value={editForm.surname}
										onChange={e =>
											setEditForm({ ...editForm, surname: e.target.value })
										}
										className={`w-full px-3 py-2 border rounded ${!validateName(editForm.surname) ? 'border-red-500' : ''}`}
									/>
								</div>
								<div>
									<label className='block mb-1'>Имя:</label>
									<input
										type='text'
										value={editForm.firstName}
										onChange={e =>
											setEditForm({ ...editForm, firstName: e.target.value })
										}
										className={`w-full px-3 py-2 border rounded ${!validateName(editForm.firstName) ? 'border-red-500' : ''}`}
									/>
								</div>
								<div>
									<label className='block mb-1'>Отчество:</label>
									<input
										type='text'
										value={editForm.middleName}
										onChange={e =>
											setEditForm({ ...editForm, middleName: e.target.value })
										}
										className={`w-full px-3 py-2 border rounded ${!validateName(editForm.middleName) ? 'border-red-500' : ''}`}
									/>
								</div>
								<div>
									<label className='block mb-1'>Роль:</label>
									<select
										value={editForm.role}
										onChange={e =>
											setEditForm({ ...editForm, role: e.target.value })
										}
										className='w-full px-3 py-2 border rounded'
									>
										<option value='user'>Пользователь</option>
										<option value='admin'>Администратор</option>
									</select>
								</div>
							</div>
							<div className='flex justify-end gap-2 mt-6'>
								<button
									onClick={() => setEditUser(null)}
									className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
								>
									Отмена
								</button>
								<button
									onClick={handleEditSubmit}
									className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
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
						<div className='bg-white rounded-lg p-6 w-full max-w-md'>
							<h2 className='text-xl font-bold mb-4'>
								Смена пароля для {passwordUser.login}
							</h2>
							<div className='space-y-4'>
								<div>
									<label className='block mb-1'>Новый пароль:</label>
									<input
										type='password'
										value={newPassword}
										onChange={e => setNewPassword(e.target.value)}
										className={`w-full px-3 py-2 border rounded ${!validatePassword(newPassword) ? 'border-red-500' : ''}`}
									/>
									{!validatePassword(newPassword) && (
										<p className='text-red-500 text-sm mt-1'>
											Только латинские буквы, цифры и спецсимволы
										</p>
									)}
								</div>
								<div>
									<label className='block mb-1'>Подтверждение пароля:</label>
									<input
										type='password'
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										className={`w-full px-3 py-2 border rounded ${newPassword !== confirmPassword ? 'border-red-500' : ''}`}
									/>
									{newPassword !== confirmPassword && (
										<p className='text-red-500 text-sm mt-1'>
											Пароли не совпадают
										</p>
									)}
								</div>
							</div>
							<div className='flex justify-end gap-2 mt-6'>
								<button
									onClick={() => setPasswordUser(null)}
									className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
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
									className={`px-4 py-2 text-white rounded ${
										!newPassword ||
										newPassword !== confirmPassword ||
										!validatePassword(newPassword)
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-green-500 hover:bg-green-600'
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
