import Container from '@/components/container'
import ArticleContainer from './articlesContainer'

export default async function Articles() {
	return (
		<main className='my-8'>
			<Container>
				<section>
					<ArticleContainer />
				</section>
			</Container>
		</main>
	)
}
