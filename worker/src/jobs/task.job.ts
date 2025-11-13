import type {Job} from 'bullmq';
import {TaskRepository} from "../repositories/TaskRepository";
import {CreateTaskDTO, Task, TaskID, UpdateTaskDTO} from "../types/task";

export default async function taskJob(job: Job<CreateTaskDTO | UpdateTaskDTO | TaskID>) {
  switch (job.name) {
    case 'createTask':
      job.data = markAsDone(job.data);

      void TaskRepository.create(job.data as CreateTaskDTO)

      break;

    case 'updateTask':
      let data = job.data as UpdateTaskDTO & { id: TaskID };

      data = markAsDone(job.data);

      void TaskRepository.updateById(data.id, data)

      break;

    case 'deleteTask':
      void TaskRepository.deleteById(job.data as TaskID)

      break;

    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}

function markAsDone(task: Task) {
  if (task.status === 'done') {
    task.completed_at = new Date().toISOString();
  } else {
    task.completed_at = undefined;
  }

  return task;
}
