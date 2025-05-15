import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guards';
import { TokenPayloadParam } from 'src/auth/param/token=payload.param';
import { PayloadTokenDTO } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { format } from 'path';

@Controller('users')
export class UsersController {

  constructor(private readonly userService: UsersService) { }


  @Get(':id')
  @ApiOperation({ summary: 'Localizar um usuário pelo ID' })
  @ApiQuery({
    name: 'id',
    example: 1,
    description: 'Colocar o id do usuario que deseja localizar'
  })
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Criar um usuário' })
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiQuery({
    name: 'id',
    example: 1,
    description: 'Colocar o id do usuario que deseja atualizar'
  })
  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDTO: UpdateUserDTO, @TokenPayloadParam() tokenPayload: PayloadTokenDTO) {
    return this.userService.update(id, updateUserDTO, tokenPayload)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiQuery({
    name: 'id',
    example: 1,
    description: 'Colocar o id do usuario que deseja deletar'
  })
  @Delete(":id")
  deleteUser(@Param("id", ParseIntPipe) id: number, @TokenPayloadParam() tokenPayload: PayloadTokenDTO) {
    return this.userService.delete(id, tokenPayload)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Para o usuário enviar uma foto de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadAvatar(
    @TokenPayloadParam() tokenPayload: PayloadTokenDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 3 * (1024 * 1024) // Tamanho maximo de 3 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    ) file: Express.Multer.File
  ) {
    return this.userService.uploadAvatarImage(tokenPayload, file)
  }

}


