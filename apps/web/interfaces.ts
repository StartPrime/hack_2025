export interface IRegisterUser {
	login: string
	password: string
	firstName: string
	surname: string
	middleName: string
	role: string
}

export interface ILoginUser {
	login: string
	password: string
}

export interface IArticle {
	id: number
	imagePath: string
	title: string
	createAt: string
	updatedBy: {
		name: string
		surname: string
		middleName: string
	}
}

export interface IDetailedArticle extends IArticle {
	content: string
	createdBy: {
		name: string
		surname: string
		middleName: string
	}
}
