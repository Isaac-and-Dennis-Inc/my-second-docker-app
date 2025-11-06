import {JsonController, Get, Delete, Put, Post} from 'routing-controllers';
import {TaskRepository} from "../repositories/TaskRepository.js";

@JsonController('/tasks')
export class TasksController {
  @Get('/')
  async read() {
    return TaskRepository.findAll()
  }
}
