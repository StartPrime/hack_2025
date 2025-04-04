import { cn } from '@workspace/ui/lib/utils'

interface Props {
	children?: React.ReactNode
	className?: string
}

export default function Container({ children, className }: Props) {
	return (
		<div className={cn(className, 'max-w-[1200px] m-auto')}>{children}</div>
	)
}
