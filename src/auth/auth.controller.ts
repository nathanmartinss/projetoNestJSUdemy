import { Body, Controller, Post } from '@nestjs/common';
import { SignInDTO } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Login/Autenticação')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Fazer login com Usuário' })
  signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.authenticate(signInDTO)
  }
}
