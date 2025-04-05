export function formatDate(dateString: string) {
	console.log(dateString)
	const date = new Date(dateString)
	const day = date.getDate()
	const month = date.toLocaleString('ru-RU', { month: 'long' })
	const year = date.getFullYear()
	return `${day} ${month} ${year} г.`
}
