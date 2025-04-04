import Container from '@/components/container'
import { IArticle } from '../../interfaces'
import ArticleContainer from './articlesContainer'

const articles: IArticle[] = [
	{
		id: 1,
		imagePath: '/i.webp',
		title: 'Основы TypeScript для начинающих',
		createAt: '04.04.2025',
		updatedBy: {
			name: 'Иван',
			surname: 'Петров',
			middleName: 'Сергеевич',
		},
	},
	{
		id: 2,
		imagePath: '/i.webp',
		title: 'React и Redux: современный стэк разработки',
		createAt: '04.04.2025',
		updatedBy: {
			name: 'Анна',
			surname: 'Смирнова',
			middleName: 'Игоревна',
		},
	},
	{
		id: 3,
		imagePath: '/i.webp',
		title: 'Оптимизация производительности веб-приложений',
		createAt: '04.04.2025',
		updatedBy: {
			name: 'Дмитрий',
			surname: 'Козлов',
			middleName: 'Александрович',
		},
	},
	{
		id: 4,
		imagePath: '/i.webp',
		title: 'Введение в Docker и контейнеризацию',
		createAt: '04.04.2025',
		updatedBy: {
			name: 'Елена',
			surname: 'Васильева',
			middleName: 'Дмитриевна',
		},
	},
	{
		id: 5,
		imagePath: '/i.webp',
		title: 'Лучшие практики работы с Git',
		createAt: '04.04.2025',
		updatedBy: {
			name: 'Сергей',
			surname: 'Иванов',
			middleName: 'Петрович',
		},
	},
]

export default function Articles() {
	return (
		<main className='my-8'>
			<Container>
				<section>
					<h1 className='text-2xl font-bold'>Статьи</h1>
					<ArticleContainer articles={articles} />
				</section>
			</Container>
		</main>
	)
}
