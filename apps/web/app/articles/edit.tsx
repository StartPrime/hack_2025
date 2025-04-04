'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'

type Props = {
	content?: string
	onChange?: (content: string) => void
}

const Edit = ({ content = '', onChange }: Props) => {
	const editor = useEditor({
		extensions: [
			Highlight.configure({ multicolor: true }),
			StarterKit.configure({ codeBlock: false }),
			Underline,
			TextStyle,
			Color,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
				alignments: ['left', 'center', 'right'],
				defaultAlignment: 'left',
			}),
			Image.configure({
				inline: true,
				allowBase64: true,
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
		}
	}

	const isActive = (format: string) => editor.isActive(format)

	return (
		<div className='space-y-3'>
			{/* Панель инструментов */}
			<div className='flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg'>
				{['bold', 'italic', 'underline', 'strike'].map(format => (
					<button
						key={format}
						onClick={() => toggleFormat(format)}
						className={`p-2 rounded hover:bg-gray-200 ${
							isActive(format) ? 'bg-gray-300' : ''
						}`}
					>
						{format === 'bold' && <strong>B</strong>}
						{format === 'italic' && <em>I</em>}
						{format === 'underline' && <u>U</u>}
						{format === 'strike' && <s>S</s>}
					</button>
				))}

				<select
					onChange={e =>
						editor.chain().focus().setTextAlign(e.target.value).run()
					}
					className='p-2 border rounded'
				>
					<option value='left'>Слева</option>
					<option value='center'>По центру</option>
					<option value='right'>Справа</option>
				</select>

				<select
					onChange={e => editor.chain().focus().setColor(e.target.value).run()}
					className='p-2 border rounded'
				>
					<option value=''>Цвет текста</option>
					{textColors.map(color => (
						<option key={color.value} value={color.value}>
							{color.label}
						</option>
					))}
				</select>

				<select
					onChange={e =>
						editor.chain().focus().setHighlight({ color: e.target.value }).run()
					}
					className='p-2 border rounded'
				>
					<option value=''>Фон текста</option>
					{highlightColors.map(color => (
						<option key={color.value} value={color.value}>
							{color.label}
						</option>
					))}
				</select>

				<label className='cursor-pointer p-2 border rounded hover:bg-gray-200'>
					Изображение
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
					className='flex gap-1 p-1 bg-	 shadow-lg rounded'
				>
					{['bold', 'italic', 'underline'].map(format => (
						<button
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
				</BubbleMenu>
			)}

			<EditorContent editor={editor} />
		</div>
	)
}

export default Edit
