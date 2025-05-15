import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDTO } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) { }

  async authenticate(signInDTO: SignInDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDTO.email,
        active: true
      }
    })

    if (!user) {
      throw new HttpException("Usuário não encontrado", HttpStatus.UNAUTHORIZED)
    }

    const passwordValid = await this.hashingService.compare(signInDTO.password, user.passwordHash)

    if (!passwordValid) {
      throw new HttpException("Usuário e/ou Senha invalidos", HttpStatus.UNAUTHORIZED)
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer
      }
    )

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    }
  }
}
