import { Controller, Get, Param, ParseUUIDPipe, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, OrganisationMemberGuard } from '../common';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Request() req) {
    const id = req.user.userId;
    console.log({id})
    const user = await this.userService.findById(id);

    return {
      status: 'success',
      message: 'User fetched successfully',
      data: user,
    };
  }

  @UseGuards(AuthGuard, OrganisationMemberGuard)
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);

    return {
      status: 'success',
      message: 'User fetched successfully',
      data: user,
    };
  }
}
