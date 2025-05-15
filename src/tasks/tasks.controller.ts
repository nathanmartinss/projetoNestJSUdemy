import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDTO } from 'src/tasks/dto/update-task.dto';
import { PaginationDTO } from 'src/commom/dto/pagination.dto';
import { BodyCreateTaskInterceptor } from 'src/commom/interceptors/boddy-create-task.interceptor';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guards';
import { TokenPayloadParam } from 'src/auth/param/token=payload.param';
import { PayloadTokenDTO } from 'src/auth/dto/payload-token.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService,
    @Inject('KEY_TOKEN')
    private readonly keyToken: string
  ) { }

  @Get()
  @ApiOperation({ summary: 'Listar todos os IDs' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Limite de tarefas a serem puxadas'
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 10,
    description: 'Itens que deseja pular'
  })
  getTasks(@Query() paginationDTO: PaginationDTO) {
    return this.tasksService.findAll(paginationDTO);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Buscar tarefa pelo id',
    example: 1
  })
  @ApiOperation({ summary: 'Listar um ID' })
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma tarefa' })
  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO, @TokenPayloadParam() tokenPayload: PayloadTokenDTO) {
    return this.tasksService.create(createTaskDTO, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  @Patch(":id")
  updateTask(@Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDTO, @TokenPayloadParam() tokenPayload: PayloadTokenDTO) {
    return this.tasksService.update(id, updateTaskDto, tokenPayload)
  }

  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @ApiBearerAuth()
  @Delete(":id")
  deleteTask(@Param("id", ParseIntPipe) id: number, @TokenPayloadParam() tokenPayload: PayloadTokenDTO) {
    return this.tasksService.delete(id, tokenPayload)
  }

}