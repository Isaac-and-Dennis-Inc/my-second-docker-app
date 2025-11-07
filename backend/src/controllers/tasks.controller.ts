import {Get, JsonController} from "routing-controllers";
import {TaskRepository} from "../repositories/TaskRepository.js";

@JsonController('/tasks')
export class TasksController {
  @Get('/')
  async get() {
    return TaskRepository.findAll()
  }
}
