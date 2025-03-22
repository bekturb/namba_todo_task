import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from 'src/common/interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  registerUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userService.createUser(createUserDto);
    return user;
  }

  async login(loginDto: LoginDto, res): Promise<void> {
    const user = await this.validateUser(loginDto);
    const payload: TokenPayload = { email: user.email, sub: user.id };

    const { accessToken } = await this.generateToken(payload);

    this.setCookie(res, accessToken);

    delete user.password;
    res.status(200).send(user);
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await this.isPasswordValid(password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return user;
  }

  private async isPasswordValid(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async generateToken(
    payload: TokenPayload,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: this.configService.get('JWT_ACCESS_TOKEN_KEY'),
    });
    return { accessToken };
  }

  private setCookie(res, accessToken: string): void {
    res.cookie('accessToken', accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: this.configService.get('COOKIE_HTTP_ONLY'),
      secure: this.configService.get('COOKIE_SECURE'),
      sameSite: this.configService.get('COOKIE_SAME_SITE'),
    });
  }
}
