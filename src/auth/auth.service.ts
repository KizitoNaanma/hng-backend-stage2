import { Injectable, ConflictException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OrganisationService } from '../organisation/organisation.service';
import { CreateUserDto } from '../core';
import { CustomBadRequestException } from '../common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
        throw new CustomBadRequestException('User already exists');
    }

    const user = await this.userService.create(createUserDto);
    const organisationName = `${createUserDto.firstName}'s Organisation`;
    const organisation = await this.organisationService.create({ name: organisationName }, user);
    const accessToken = this.jwtService.sign({ userId: user.userId, email: user.email });
    const { password, ...result } = user
    return { accessToken, user: result };
  }

  async signIn(email: string, passwrd: string) {
    const user = await this.userService.validateUser(email, passwrd);
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }
    const accessToken = this.jwtService.sign({ userId: user.userId, email });
    const { password, ...result } = user

    return { accessToken, user: result };
  }
}
