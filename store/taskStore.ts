import { create } from 'zustand';
import { Task } from '../types/models';
import { mockApi } from '../services/mockApi';

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;

    fetchTasks: (filters?: any) => Promise<void>;
    getTaskById: (id: string) => Task | undefined;
    getTasksByEpicId: (epicId: string) => Task[];
    addTask: (task: Partial<Task>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    assignToEpic: (taskId: string, epicId: string | null) => void;
    clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async (filters) => {
        set({ loading: true, error: null });
        try {
            const tasks = await mockApi.getTasks(filters);
            set({ tasks, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch tasks', loading: false });
        }
    },

    getTaskById: (id) => {
        return get().tasks.find(t => t.id === id);
    },

    getTasksByEpicId: (epicId) => {
        return get().tasks.filter(t => t.epicId === epicId);
    },

    addTask: (task) => {
        const newTask = {
            id: `task-${Date.now()}`,
            userId: 'user-1',
            isDraft: false,
            status: 'todo',
            createdAt: new Date().toISOString(),
            completedAt: null,
            epicId: null,
            ...task,
        } as Task;

        set(state => ({ tasks: [...state.tasks, newTask] }));
    },

    updateTask: (id, updates) => {
        set(state => ({
            tasks: state.tasks.map(t =>
                t.id === id ? { ...t, ...updates } : t
            ),
        }));
    },

    deleteTask: (id) => {
        set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    },

    assignToEpic: (taskId, epicId) => {
        set(state => ({
            tasks: state.tasks.map(t =>
                t.id === taskId ? { ...t, epicId } : t
            ),
        }));
    },

    clearTasks: () => {
        set({ tasks: [] });
    },
}));
