import { Roboto_Mono } from 'next/font/google'
import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'

const fontRoboto = Roboto_Mono({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-mono',
	weight: ['400', '700'],
	display: 'swap',
})

export const metadata = {
	title: 'Технические статьи и руководства',
	description: 'Коллекция полезных технических статей и руководств',
	icons: {
		icon: '/favicon.svg',
	},
}

export default function ArticlesLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body
				className={`${fontRoboto.variable} font-sans antialiased bg-gray-200`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
