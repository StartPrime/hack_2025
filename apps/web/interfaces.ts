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
	image: string
	title: string
	createAt: string
	updateBy: {
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

export interface ITask {
	id: number
	title: string
	createAt: string
	assignedTo: {
		name: string
		surname: string
		middleName: string
	}
	dueDate: string
	priority: Priority
	status: TaskStatus
}

export interface IDetailedTask extends ITask {
	description: string
	createdBy: {
		name: string
		surname: string
		middleName: string
	}
	updatedBy: {
		name: string
		surname: string
		middleName: string
	}
}

export enum TaskStatus {
	ACTIVE = 'ACTIVE',
	POSTPONED = 'POSTPONED',
	COMPLETED = 'COMPLETED',
}

export enum Priority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}
