import { Controller, Get, Param, UseGuards, Req, Request, NotFoundException, Post, Body } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
// import { Request } from 'express';
import { AuthGuard, CustomBadRequestException, OrganisationMemberGuard } from 'src/common';
import { AddUserDto, CreateOrganisationDto } from 'src/core';
import { UserService } from 'src/user/user.service';

@Controller('api/organisations')
export class OrganisationController {
  constructor(
    private readonly organisationService: OrganisationService,
    private readonly userService: UserService,
    ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getMyOrganisations(@Request() req) {
    const user = req.user;
    const data = await this.organisationService.findByUser(user.userId);

    return {
      status: 'success',
      message: 'Organisation fetched successfully',
      data: {organisations: data},
    };
  }

  // @UseGuards(AuthGuard, OrganisationMemberGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOrganisation(@Param('id') id: string) {
    const data = await this.organisationService.findById(id);

    return {
      status: 'success',
      message: 'Organisation fetched successfully',
      data
    };  
  }

  @UseGuards(AuthGuard)
  @Post()
  async createOrganisation(@Body() createOrgDto: CreateOrganisationDto, @Request() req) {
    try {
    const user = await this.userService.getDetails(req.user.userId)
    const data = await this.organisationService.create(createOrgDto, user);

    return {
      status: 'success',
      message: 'Organisation created successfully',
      data
    };
  } catch(error){
    console.log(error)
    throw new CustomBadRequestException('Client error');
    }
  }

  @UseGuards(AuthGuard)
  @Post(':orgId/users')
  async addUser(@Param('orgId') orgId: string, @Body() addUserDto: AddUserDto) {
    const user = await this.userService.getDetails(addUserDto.userId)
    await this.organisationService.addUser(orgId, user);

    return {
      status: 'success',
      message: 'User added to organisation successfully',
    }
  }
}
