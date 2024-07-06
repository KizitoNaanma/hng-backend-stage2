import { Controller, Post, Body, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInDto } from 'src/core';
import { CustomBadRequestException, ValidationPipe } from 'src/common';
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
        console.log(error)
        throw new CustomBadRequestException('Registration unsuccessful');

    }
  }

//   @Public()
  @Post('login')
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
