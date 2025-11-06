export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskID = number;
export type IsoDateString = string; // ISO 8601

export type Task = {
  id: TaskID;
  title: string;
  description?: string;
  status: TaskStatus;
  due_at?: IsoDateString;
  completed_at?: IsoDateString;
  created_at: IsoDateString;
  updated_at: IsoDateString;
}

export type CreateTaskDTO = Pick<Task, 'title' | 'description' | 'status' | 'due_at'>;
export type UpdateTaskDTO = Partial<Pick<Task, 'title' | 'description' | 'status' | 'due_at' | 'completed_at'>>;
