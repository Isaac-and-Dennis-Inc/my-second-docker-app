import {isNumber} from "class-validator";
import {Body, Delete, Get, JsonController, Param, Post, Put} from 'routing-controllers';
import {tasksQueue} from "../queues/tasks.queue.js";
import {TaskRepository} from "../repositories/TaskRepository.js";
import {CreateTaskDTO, TaskID, UpdateTaskDTO} from "../types/task.js";

@JsonController('/task')
export class TaskController {
  @Get('/:id')
  async get(@Param('id') id: TaskID) {
    if (!isNumber(id)) {
      throw new Error('Invalid ID');
    }

    return TaskRepository.findById(id)
  }

  @Post('/')
  async post(@Body() task: CreateTaskDTO) {
    void tasksQueue.add('createTask', task);

    return null
  }

  @Put('/:id')
  async put(@Param('id') id: TaskID, @Body() task: UpdateTaskDTO) {
    void tasksQueue.add('updateTask', {id, ...task});

    return null
  }

  @Delete('/:id')
  async delete(@Param('id') id: TaskID) {
    void tasksQueue.add('deleteTask', {id});

    return null
  }
}
