import {JsonController, Get, Delete, Put, Post, Param, Body} from 'routing-controllers';
import {tasksQueue} from "../queues/tasks.queue.js";
import {TaskRepository} from "../repositories/TaskRepository.js";
import {CreateTaskDTO, TaskID, UpdateTaskDTO} from "../types/task.js";

@JsonController('/task')
export class TaskController {
  @Get('/:id')
  async read(@Param('id') id: TaskID) {
    return TaskRepository.findOne(id)
  }

  @Post('/')
  async create(@Body() taskData: CreateTaskDTO) {
    void tasksQueue.add('createTask', taskData);

    return null
  }

  @Put('/:id')
  async update(@Body() taskData: UpdateTaskDTO, @Param('id') id: TaskID) {
    void tasksQueue.add('updateTask', {id, ...taskData});

    return null
  }

  @Delete('/:id')
  async delete(@Param('id') id: TaskID) {
    void tasksQueue.add('deleteTask', {id});

    return null
  }
}
