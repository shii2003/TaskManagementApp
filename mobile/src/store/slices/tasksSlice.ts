import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskAPI, Task, CreateTaskData, UpdateTaskData, TaskQueryParams } from '../../services/tasks';

interface TasksState {
    tasks: Task[];
    currentTask: Task | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    filters: {
        status?: 'todo' | 'in_progress' | 'completed';
        search?: string;
    };
}

const initialState: TasksState = {
    tasks: [],
    currentTask: null,
    isLoading: false,
    isRefreshing: false,
    error: null,
    filters: {},
};


export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (params: TaskQueryParams, { rejectWithValue }) => {
        try {
            const tasks = await taskAPI.getAll(params);
            return tasks;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch tasks');
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'tasks/fetchTaskById',
    async (id: string, { rejectWithValue }) => {
        try {
            const task = await taskAPI.getById(id);
            return task;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch task');
        }
    }
);

export const createTaskAsync = createAsyncThunk(
    'tasks/createTask',
    async (data: CreateTaskData, { rejectWithValue }) => {
        try {
            const task = await taskAPI.create(data);
            return task;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create task');
        }
    }
);

export const updateTaskAsync = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
        try {
            const task = await taskAPI.update(id, data);
            return task;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update task');
        }
    }
);

export const deleteTaskAsync = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            await taskAPI.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete task');
        }
    }
);

export const updateTaskStatusAsync = createAsyncThunk(
    'tasks/updateStatus',
    async ({ id, status }: { id: string; status: 'todo' | 'in_progress' | 'completed' }, { rejectWithValue }) => {
        try {
            const task = await taskAPI.updateStatus(id, status);
            return task;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update task status');
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<{ status?: 'todo' | 'in_progress' | 'completed'; search?: string }>) => {
            state.filters = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state, meta) => {
                if (meta.meta.arg?.search || state.isRefreshing) {
                    state.isRefreshing = true;
                } else {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.isLoading = false;
                state.isRefreshing = false;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
                state.isRefreshing = false;
            })
            // Fetch task by ID
            .addCase(fetchTaskById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.currentTask = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            // Create task
            .addCase(createTaskAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTaskAsync.fulfilled, (state, action) => {
                state.tasks.unshift(action.payload);
                state.isLoading = false;
            })
            .addCase(createTaskAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            // Update task
            .addCase(updateTaskAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                if (state.currentTask?._id === action.payload._id) {
                    state.currentTask = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateTaskAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            // Delete task
            .addCase(deleteTaskAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task._id !== action.payload);
                state.isLoading = false;
            })
            .addCase(deleteTaskAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            // Update task status
            .addCase(updateTaskStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                if (state.currentTask?._id === action.payload._id) {
                    state.currentTask = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateTaskStatusAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            });
    },
});

export const { setFilter, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;

