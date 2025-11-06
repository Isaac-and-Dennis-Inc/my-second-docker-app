import {postgres} from "../postgres.js";
import {CreateTaskDTO, Task, TaskID, UpdateTaskDTO} from "../types/task.js";

export const TaskRepository = {
  createOne: async (task: CreateTaskDTO): Promise<Task> => {
    const response = await postgres.query(`
        INSERT INTO tasks (title, description, status, due_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [task.title, task.description, task.status, task.due_at]
    )

    return response.rows[0]
  },

  updateOne: async (id: TaskID, task: UpdateTaskDTO): Promise<Task> => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(task)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    values.push(id);

    const query = `
      UPDATE tasks
      SET ${fields.join(', ')},
          updated_at = now()
      WHERE id = $${index}
      RETURNING *
    `;

    const response = await postgres.query(query, values);

    return response.rows[0];
  },

  deleteOne: async (id: TaskID): Promise<void> => {
    await postgres.query('DELETE FROM tasks WHERE id = $1', [id]);
  }
}
