/* eslint-disable prettier/prettier */
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getRoot(): string {
    return 'Hello from NestJS!';
  }

  @Get('/testando')
  getTestando() {
    return 'testando o endpoint';
  }

  @Post('/testando')
  createTestando() {
    return 'testando o endpoint';
  }
}
