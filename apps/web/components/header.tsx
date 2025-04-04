'use client'

import Container from './container'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { FaTasks } from 'react-icons/fa'
import { RiAdminLine } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
	const pathname = usePathname()

	const isInfoActive = pathname === '/articles'
	const isTasksActive = pathname === '/tasks'
	const isAdminActive = pathname === '/admin'

	return (
		<header className='mt-4'>
			<Container>
				<nav className='flex justify-end gap-8'>
					<Link
						href='/articles'
						className={`cursor-pointer duration-200 hover:scale-105 flex gap-1 items-center justify-center ${
							isInfoActive ? 'text-primary  underline' : 'text-primary'
						}`}
					>
						<IoInformationCircleOutline size={20} />
						Полезная информация
					</Link>

					<Link
						href='/tasks'
						className={`cursor-pointer duration-200 hover:scale-105 flex gap-1 items-center justify-center ${
							isTasksActive
								? 'text-primary font-bold underline'
								: 'text-primary'
						}`}
					>
						<FaTasks size={20} />
						Задачи
					</Link>

					<Link
						href='/admin'
						className={`cursor-pointer duration-200 hover:scale-105 flex gap-1 items-center justify-center ${
							isAdminActive
								? 'text-primary font-bold underline'
								: 'text-primary'
						}`}
					>
						<RiAdminLine size={20} />
						Администрирование
					</Link>
				</nav>
			</Container>
		</header>
	)
}
