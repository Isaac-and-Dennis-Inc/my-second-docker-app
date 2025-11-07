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

  create: async (data: CreateTaskDTO): Promise<Task | null> => {
    const response = await postgres.query(`
      INSERT INTO tasks (title, description, due_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [data.title, data.description || null, data.due_at || null]);

    return response.rows[0] || null;
  },

  updateById: async (id: TaskID, data: UpdateTaskDTO): Promise<Task | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in data) {
      const value = data[key as keyof UpdateTaskDTO];

      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    if (fields.length > 0) {
      values.push(id);

      const response = await postgres.query(`
        UPDATE tasks
        SET ${fields.join(', ')},
            updated_at = now()
        WHERE id = $${index}
    `, values);
    }

    return await TaskRepository.findById(id);
  },

  deleteById: async (id: TaskID): Promise<boolean> => {
    const response = await postgres.query(`
      DELETE
      FROM tasks
      WHERE id = $1
    `, [id]);

    return !!response.rowCount;
  }
}
