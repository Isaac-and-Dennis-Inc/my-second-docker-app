import {postgres} from "../postgres.js";
import {Task, TaskID} from "../types/task.js";

export const TaskRepository = {
  findOne: async (id: TaskID): Promise<Task> => {
    const response = await postgres.query('SELECT * FROM tasks WHERE id = $1', [id])

    return response.rows[0]
  },

  findAll: async (): Promise<Task[]> => {
    const response = await postgres.query('SELECT * FROM tasks ORDER BY created_at DESC')

    return response.rows
  }
}
