import { create } from 'zustand'

interface StateAuth {
	active: boolean
	setStateAuth: () => void
}

export const useStateAuth = create<StateAuth>()(set => ({
	active: true,
	setStateAuth: () => set(state => ({ active: !state.active })),
}))
