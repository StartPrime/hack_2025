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
