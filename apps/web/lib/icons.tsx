export const CloseIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M6 18L18 6M6 6l12 12'
		/>
	</svg>
)

export const UploadIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
		/>
	</svg>
)

export const PlusIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M12 6v6m0 0v6m0-6h6m-6 0H6'
		/>
	</svg>
)

// src/lib/icons/clock.tsx
export function ClockIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			className={className}
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
			/>
		</svg>
	)
}

// src/lib/icons/list-bullet.tsx
export function ListBulletIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			className={className}
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M4 6h16M4 12h16M4 18h16'
			/>
		</svg>
	)
}
