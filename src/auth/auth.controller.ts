import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInDto } from '../core';
import { CustomBadRequestException, ValidationPipe } from '../common';
// import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//   @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      return {
        status: 'success',
        message: 'Registration successful',
        data: user,
      };
    } catch (error) {
        // console.log(error)
        throw new CustomBadRequestException('Registration unsuccessful');

    }
  }

//   @Public()
  @Post('login')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const result = await this.authService.signIn(signInDto.email, signInDto.password);
      return {
        status: 'success',
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
        throw new CustomBadRequestException('Authentication failed', 401);
    }
  }
}
