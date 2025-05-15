import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service'
import { PaginationDTO } from 'src/commom/dto/pagination.dto';
import { PayloadTokenDTO } from 'src/auth/dto/payload-token.dto';
import { ResponseTaskDTO } from './dto/response-task-dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findAll(paginationDto?: PaginationDTO): Promise<ResponseTaskDTO[]> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        id: "desc"
      }
    });

    return allTasks;
  }

  async findOne(id: number): Promise<ResponseTaskDTO> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id
      }
    })

    if (task?.name) return task;

    throw new HttpException("Tarefa não foi encontrada!", HttpStatus.BAD_REQUEST)

  }

  async create(createTaskDto: CreateTaskDTO, tokenPayload: PayloadTokenDTO): Promise<ResponseTaskDTO> {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
          userId: tokenPayload.sub
        }
      })

      return newTask;
    } catch (err) {
      console.log(err);
      throw new HttpException("Falhaa ao cadastrar trarefa", HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDTO, tokenPayload: PayloadTokenDTO): Promise<ResponseTaskDTO> {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      })

      if (!findTask) {
        throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
      }

      if (findTask.userId !== tokenPayload.sub) {
        throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
      }


      const task = await this.prisma.task.update({
        where: {
          id: findTask.id
        },
        data: {
          name: updateTaskDto?.name ? updateTaskDto?.name : findTask.name,
          description: updateTaskDto?.description ? updateTaskDto?.description : findTask.description,
          completed: updateTaskDto?.completed ? updateTaskDto?.completed : findTask.completed,
        }
      })

      return task;
    } catch (err) {
      throw new HttpException("Falha ao atualizar essa tarefa", HttpStatus.BAD_REQUEST)
    }
  }


  async delete(id: number, tokenPayload: PayloadTokenDTO) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      })

      if (!findTask) {
        throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
      }

      if (findTask.userId !== tokenPayload.sub) {
        throw new HttpException("Falha ao deletar essa tarefa!", HttpStatus.BAD_REQUEST)
      }

      await this.prisma.task.delete({
        where: {
          id: findTask.id
        }
      })

      return {
        message: "Tarefa deletada com sucesso!"
      }
    } catch (err) {
      throw new HttpException("Falha ao deletar essa tarefa", HttpStatus.BAD_REQUEST)
    }

  }
}
