import type {Job} from 'bullmq';
import {TaskRepository} from "../repositories/TaskRepository";
import {CreateTaskDTO, TaskID, UpdateTaskDTO} from "../types/task";

export default async function taskJob(job: Job<CreateTaskDTO | UpdateTaskDTO | TaskID>) {
  switch (job.name) {
    case 'createTask':
      void TaskRepository.create(job.data as CreateTaskDTO)

      break;

    case 'updateTask':
      const data = job.data as UpdateTaskDTO & { id: TaskID };

      void TaskRepository.updateById(data.id, data)

      break;

    case 'deleteTask':
      void TaskRepository.deleteById(job.data as TaskID)

      break;

    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}
