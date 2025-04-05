import { ITask, Priority, TaskStatus } from '@/interfaces'
import TasksCOntainer from './tasksContainer'

const tasks: ITask[] = [
	{
		id: 1,
		title: 'Разработать главную страницу',
		createAt: '2023-05-15',
		assignedTo: {
			name: 'Иван',
			surname: 'Петров',
			middleName: 'Сергеевич',
		},
		dueDate: '2023-06-01',
		priority: Priority.HIGH,
		status: TaskStatus.ACTIVE,
	},
	{
		id: 2,
		title: 'Написать API для авторизации',
		createAt: '2023-05-10',
		assignedTo: {
			name: 'Анна',
			surname: 'Смирнова',
			middleName: 'Игоревна',
		},
		dueDate: '2023-05-25',
		priority: Priority.MEDIUM,
		status: TaskStatus.COMPLETED,
	},
	{
		id: 3,
		title: 'Протестировать модуль платежей',
		createAt: '2023-05-18',
		assignedTo: {
			name: 'Дмитрий',
			surname: 'Козлов',
			middleName: 'Александрович',
		},
		dueDate: '2023-05-30',
		priority: Priority.LOW,
		status: TaskStatus.POSTPONED,
	},
	{
		id: 4,
		title: 'Обновить документацию',
		createAt: '2023-05-20',
		assignedTo: {
			name: 'Елена',
			surname: 'Васильева',
			middleName: 'Дмитриевна',
		},
		dueDate: '2023-06-05',
		priority: Priority.MEDIUM,
		status: TaskStatus.ACTIVE,
	},
	{
		id: 5,
		title: 'Исправить баги в мобильной версии',
		createAt: '2023-05-22',
		assignedTo: {
			name: 'Алексей',
			surname: 'Федоров',
			middleName: 'Николаевич',
		},
		dueDate: '2023-05-29',
		priority: Priority.HIGH,
		status: TaskStatus.ACTIVE,
	},
	{
		id: 6,
		title: 'Оптимизировать запросы к базе данных',
		createAt: '2023-05-12',
		assignedTo: {
			name: 'Ольга',
			surname: 'Морозова',
			middleName: 'Викторовна',
		},
		dueDate: '2023-05-31',
		priority: Priority.HIGH,
		status: TaskStatus.COMPLETED,
	},
	{
		id: 7,
		title: 'Добавить фильтрацию в таблицу',
		createAt: '2023-05-17',
		assignedTo: {
			name: 'Сергей',
			surname: 'Новиков',
			middleName: 'Павлович',
		},
		dueDate: '2023-06-07',
		priority: Priority.MEDIUM,
		status: TaskStatus.ACTIVE,
	},
	{
		id: 8,
		title: 'Создать лендинг для нового продукта',
		createAt: '2023-05-14',
		assignedTo: {
			name: 'Мария',
			surname: 'Кузнецова',
			middleName: 'Андреевна',
		},
		dueDate: '2023-06-10',
		priority: Priority.LOW,
		status: TaskStatus.POSTPONED,
	},
	{
		id: 9,
		title: 'Настроить CI/CD pipeline',
		createAt: '2023-05-19',
		assignedTo: {
			name: 'Андрей',
			surname: 'Лебедев',
			middleName: 'Олегович',
		},
		dueDate: '2023-06-03',
		priority: Priority.HIGH,
		status: TaskStatus.ACTIVE,
	},
	{
		id: 10,
		title: 'Провести ревью кода',
		createAt: '2023-05-21',
		assignedTo: {
			name: 'Наталья',
			surname: 'Соколова',
			middleName: 'Ивановна',
		},
		dueDate: '2023-05-28',
		priority: Priority.MEDIUM,
		status: TaskStatus.COMPLETED,
	},
]

export default function Tasks() {
	return (
		<>
			<TasksCOntainer tasks={tasks} />
		</>
	)
}
