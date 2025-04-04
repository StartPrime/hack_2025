'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'

type Props = {
	content?: string
	onChange?: (content: string) => void
}

const Edit = ({ content = '', onChange }: Props) => {
	const editor = useEditor({
		extensions: [
			Highlight.configure({ multicolor: true }),
			StarterKit.configure({
				codeBlock: false,
				bulletList: false,
				orderedList: false,
			}),
			Underline,
			TextStyle,
			Color,
			TextAlign.configure({
				types: ['heading', 'paragraph', 'listItem'],
				alignments: ['left', 'center', 'right'],
				defaultAlignment: 'left',
			}),
			Image.configure({
				inline: true,
				allowBase64: true,
			}),
			ListItem,
			BulletList.configure({
				HTMLAttributes: {
					class: 'list-disc pl-5 my-1',
				},
			}),
			OrderedList.configure({
				HTMLAttributes: {
					class: 'list-decimal pl-5 my-1',
				},
			}),
		],
		content,
		onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
	})

	if (!editor) return null

	const textColors = [
		{ value: '#000000', label: 'Чёрный' },
		{ value: '#FF0000', label: 'Красный' },
		{ value: '#00FF00', label: 'Зелёный' },
		{ value: '#0000FF', label: 'Синий' },
	]

	const highlightColors = [
		{ value: '#FFE0E0', label: 'Светло-красный' },
		{ value: '#E0FFE0', label: 'Светло-зелёный' },
		{ value: '#E0E0FF', label: 'Светло-синий' },
	]

	const toggleFormat = (format: string) => {
		switch (format) {
			case 'bold':
				return editor.chain().focus().toggleBold().run()
			case 'italic':
				return editor.chain().focus().toggleItalic().run()
			case 'underline':
				return editor.chain().focus().toggleUnderline().run()
			case 'strike':
				return editor.chain().focus().toggleStrike().run()
			case 'bulletList':
				return editor.chain().focus().toggleBulletList().run()
			case 'orderedList':
				return editor.chain().focus().toggleOrderedList().run()
		}
	}

	const isActive = (format: string) => editor.isActive(format)

	return (
		<div className='space-y-3'>
			{/* Панель инструментов */}
			<div className='flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg'>
				{/* Кнопки форматирования текста */}
				{['bold', 'italic', 'underline', 'strike'].map(format => (
					<button
						key={format}
						onClick={() => toggleFormat(format)}
						className={`p-2 rounded hover:bg-gray-200 ${
							isActive(format) ? 'bg-gray-300' : ''
						}`}
						title={
							format === 'bold'
								? 'Жирный (Ctrl+B)'
								: format === 'italic'
									? 'Курсив (Ctrl+I)'
									: format === 'underline'
										? 'Подчеркивание (Ctrl+U)'
										: 'Зачеркивание'
						}
					>
						{format === 'bold' && <strong>B</strong>}
						{format === 'italic' && <em>I</em>}
						{format === 'underline' && <u>U</u>}
						{format === 'strike' && <s>S</s>}
					</button>
				))}

				{/* Кнопки списков */}
				<button
					type='button'
					onClick={() => toggleFormat('bulletList')}
					className={`p-2 rounded hover:bg-gray-200 ${
						isActive('bulletList') ? 'bg-gray-300' : ''
					}`}
					title='Маркированный список (Ctrl+Shift+8)'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 6h16M4 12h16M4 18h16'
						/>
						<circle cx='7' cy='6' r='1' fill='currentColor' />
						<circle cx='7' cy='12' r='1' fill='currentColor' />
						<circle cx='7' cy='18' r='1' fill='currentColor' />
					</svg>
				</button>

				<button
					type='button'
					onClick={() => toggleFormat('orderedList')}
					className={`p-2 rounded hover:bg-gray-200 ${
						isActive('orderedList') ? 'bg-gray-300' : ''
					}`}
					title='Нумерованный список (Ctrl+Shift+7)'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 6h16M4 12h16M4 18h16'
						/>
						<text
							x='5'
							y='7'
							fontFamily='Arial'
							fontSize='10'
							fill='currentColor'
						>
							1.
						</text>
						<text
							x='5'
							y='13'
							fontFamily='Arial'
							fontSize='10'
							fill='currentColor'
						>
							2.
						</text>
						<text
							x='5'
							y='19'
							fontFamily='Arial'
							fontSize='10'
							fill='currentColor'
						>
							3.
						</text>
					</svg>
				</button>

				{/* Выбор выравнивания */}
				<select
					onChange={e =>
						editor.chain().focus().setTextAlign(e.target.value).run()
					}
					className='p-2 border rounded bg-white'
					title='Выравнивание текста'
				>
					<option value='left'>Слева</option>
					<option value='center'>По центру</option>
					<option value='right'>Справа</option>
				</select>

				{/* Выбор цвета текста */}
				<select
					onChange={e => editor.chain().focus().setColor(e.target.value).run()}
					className='p-2 border rounded bg-white'
					title='Цвет текста'
				>
					<option value=''>Цвет текста</option>
					{textColors.map(color => (
						<option key={color.value} value={color.value}>
							{color.label}
						</option>
					))}
				</select>

				{/* Выбор фона текста */}
				<select
					onChange={e =>
						editor.chain().focus().setHighlight({ color: e.target.value }).run()
					}
					className='p-2 border rounded bg-white'
					title='Фон текста'
				>
					<option value=''>Фон текста</option>
					{highlightColors.map(color => (
						<option key={color.value} value={color.value}>
							{color.label}
						</option>
					))}
				</select>

				{/* Кнопка вставки изображения */}
				<label
					className='cursor-pointer p-2 border rounded hover:bg-gray-200'
					title='Вставить изображение'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
						/>
					</svg>
					<input
						type='file'
						accept='image/*'
						className='hidden'
						onChange={e => {
							const file = e.target.files?.[0]
							if (file) {
								const reader = new FileReader()
								reader.onload = event => {
									editor
										.chain()
										.focus()
										.setImage({ src: event.target?.result as string })
										.run()
								}
								reader.readAsDataURL(file)
							}
						}}
					/>
				</label>
			</div>

			{/* Bubble меню */}
			{editor && (
				<BubbleMenu
					editor={editor}
					className='flex gap-1 p-1 bg-white shadow-lg rounded'
				>
					{['bold', 'italic', 'underline'].map(format => (
						<button
							type='button'
							key={format}
							onClick={() => toggleFormat(format)}
							className={`p-1 rounded hover:bg-gray-100 ${
								isActive(format) ? 'bg-gray-200' : ''
							}`}
						>
							{format === 'bold' && <strong>B</strong>}
							{format === 'italic' && <em>I</em>}
							{format === 'underline' && <u>U</u>}
						</button>
					))}
					<button
						onClick={() => toggleFormat('bulletList')}
						className={`p-1 rounded hover:bg-gray-100 ${
							isActive('bulletList') ? 'bg-gray-200' : ''
						}`}
					>
						<svg
							className='w-5 h-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<circle cx='5' cy='7' r='1' fill='currentColor' />
							<circle cx='5' cy='12' r='1' fill='currentColor' />
							<circle cx='5' cy='17' r='1' fill='currentColor' />
						</svg>
					</button>
					<button
						onClick={() => toggleFormat('orderedList')}
						className={`p-1 rounded hover:bg-gray-100 ${
							isActive('orderedList') ? 'bg-gray-200' : ''
						}`}
					>
						<svg
							className='w-5 h-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<text
								x='3'
								y='7'
								fontFamily='Arial'
								fontSize='10'
								fill='currentColor'
							>
								1.
							</text>
							<text
								x='3'
								y='12'
								fontFamily='Arial'
								fontSize='10'
								fill='currentColor'
							>
								2.
							</text>
							<text
								x='3'
								y='17'
								fontFamily='Arial'
								fontSize='10'
								fill='currentColor'
							>
								3.
							</text>
						</svg>
					</button>
				</BubbleMenu>
			)}

			{/* Область редактирования */}
			<EditorContent
				editor={editor}
				className='border border-gray-200 rounded-lg p-4 min-h-[150px]'
			/>
		</div>
	)
}

export default Edit
