import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import Header from '@/components/header'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div suppressHydrationWarning className='bg-gray-200'>
			<Header />
			<Providers>{children}</Providers>
		</div>
	)
}
