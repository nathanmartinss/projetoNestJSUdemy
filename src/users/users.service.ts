import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayloadTokenDTO } from 'src/auth/dto/payload-token.dto';
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { ResponseCreateUserDTO, ResponseFindOneUserDTO, ResponseUploadFileDTO } from './response-user.dto';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol) { }

  async findOne(id: number): Promise<ResponseFindOneUserDTO> {
    const user = await this.prisma.user.findFirst({

      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        Task: true
      }
    })

    if (user) return user;

    throw new HttpException('Usuario não encontrado', HttpStatus.BAD_REQUEST)
  }

  async create(createUserDTO: CreateUserDTO): Promise<ResponseCreateUserDTO> {

    try {

      const passwordHash = await this.hashingService.hash(createUserDTO.password)

      const newUser = await this.prisma.user.create({
        data: {
          name: createUserDTO.name,
          passwordHash: passwordHash,
          email: createUserDTO.email,
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return newUser;

    } catch (err) {
      throw new HttpException('Falha ao cadastrar usuário', HttpStatus.BAD_REQUEST)
    }

  }

  async update(id: number, updateUserDto: UpdateUserDTO, tokenPayloadDTO: PayloadTokenDTO): Promise<ResponseCreateUserDTO> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      })

      if (!user) {
        throw new HttpException('Usuário não existe!', HttpStatus.BAD_REQUEST)
      }

      if (user.id !== tokenPayloadDTO.sub) {
        throw new HttpException('Acesso negado.', HttpStatus.BAD_REQUEST)
      }


      const dataUser: { name?: string, passwordHash?: string } = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
      }

      if (updateUserDto?.password) {
        const passwordHash = await this.hashingService.hash(updateUserDto?.password)
        dataUser['passwordHash'] = passwordHash
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          name: dataUser.name,
          passwordHash: dataUser?.passwordHash ? dataUser?.passwordHash : user.passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      })

      return updateUser;

    } catch (err) {
      throw new HttpException('Falha ao atualizar usuário!', HttpStatus.BAD_REQUEST)
    }
  }


  async delete(id: number, tokenPayloadDTO: PayloadTokenDTO) {
    try {

      const user = await this.prisma.user.findFirst({
        where: {
          id: id
        }
      })

      if (!user) {
        throw new HttpException('Usuario não encontrado', HttpStatus.BAD_REQUEST)
      }

      if (user.id !== tokenPayloadDTO.sub) {
        throw new HttpException('Acesso negado, você não tem permissão pra esse usuário', HttpStatus.BAD_REQUEST)
      }

      await this.prisma.user.delete({
        where: {
          id: id
        }
      })

      return {
        message: "Usuário foi deletado com sucesso!"
      }

    } catch (err) {
      throw new HttpException('Falha ao deletar usuário', HttpStatus.BAD_REQUEST)
    }

  }

  async uploadAvatarImage(tokenPayload: PayloadTokenDTO, file: Express.Multer.File): Promise<ResponseUploadFileDTO> {
    try {

      const mimeType = file.mimetype;
      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1)
      const fileName = `${tokenPayload.sub}.${fileExtension}`
      const fileLocale = path.resolve(process.cwd(), 'files', fileName)
      await fs.writeFile(fileLocale, file.buffer)
      const user = await this.prisma.user.findFirst({
        where: {
          id: tokenPayload.sub
        }
      })

      if (!user) {
        throw new HttpException('Falha ao atualizar o avatar do usuário!', HttpStatus.BAD_REQUEST)
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          avatar: fileName
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      })

      return updatedUser;

    } catch (err) {
      throw new HttpException('Falha ao atualizar o avatar do usuário!', HttpStatus.BAD_REQUEST)
    }
  }
}
