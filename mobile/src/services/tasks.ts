import api from './api';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'completed';
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'completed';
    assignedTo?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'completed';
    assignedTo?: string;
}

export interface TaskQueryParams {
    status?: 'todo' | 'in_progress' | 'completed';
    search?: string;
}

// Task API calls
export const taskAPI = {
    getAll: async (params?: TaskQueryParams): Promise<Task[]> => {
        const response = await api.get<{ success: boolean; message: string; data: Task[] }>('/tasks', { params });
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch tasks');
    },

    getById: async (id: string): Promise<Task> => {
        const response = await api.get<{ success: boolean; message: string; data: Task }>(`/tasks/${id}`);
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch task');
    },

    create: async (data: CreateTaskData): Promise<Task> => {
        const response = await api.post<{ success: boolean; message: string; data: Task }>('/tasks', data);
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create task');
    },

    update: async (id: string, data: UpdateTaskData): Promise<Task> => {
        const response = await api.put<{ success: boolean; message: string; data: Task }>(`/tasks/${id}`, data);
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update task');
    },

    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`/tasks/${id}`);
        // Backend returns success message for delete, no data
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete task');
        }
    },

    updateStatus: async (id: string, status: 'todo' | 'in_progress' | 'completed'): Promise<Task> => {
        const response = await api.patch<{ success: boolean; message: string; data: Task }>(`/tasks/${id}/status`, { status });
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update task status');
    },
};

