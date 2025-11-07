import {postgres} from "../postgres.js";
import {CreateTaskDTO, Task, TaskID, UpdateTaskDTO} from "../types/task.js";

export const TaskRepository = {
  findById: async (id: TaskID): Promise<Task | null> => {
    const response = await postgres.query(`
      SELECT *
      FROM tasks
      WHERE id = $1
    `, [id]);

    return response.rows[0] || null;
  },

  findAll: async (): Promise<Task[]> => {
    const response = await postgres.query(`
      SELECT *
      FROM tasks
      ORDER BY created_at DESC
    `);

    return response.rows;
  },
}
