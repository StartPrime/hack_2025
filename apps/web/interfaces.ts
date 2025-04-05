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
	createdAt: string
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

export interface ITask {
	id: number
	title: string
	createdAt: string
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

export interface IArticleLogs {
	id: string
	title: string
	eventType: string
	changedBy: {
		name: string
		surname: string
		middleName: string
	}
	changedAt: string
	isDeleted: boolean
	articleId: string
}

export interface IUser {
	login: string
	firstName: string
	middleName: string
	surname: string
	role: string
	registrationDate: string
}

export interface ITaskLogs {
	taskName: string
	eventType: string
	changedBy: {
		name: string
		middleName: string
		surname: string
	}
	changedAt: string
	oldStatus: string
	newStatus: string
}
