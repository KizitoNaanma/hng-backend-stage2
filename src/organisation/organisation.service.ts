import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganisationDto, Organisation, User } from '../core';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,

  ) {}

  async create(createOrganisationDto: CreateOrganisationDto, user: User) {
    const organisation = this.organisationRepository.create(createOrganisationDto);
    organisation.users = [user];
    const org = await this.organisationRepository.save(organisation);
    const data = { orgId: org.orgId, name: org.name, description: org.description };

    return data
  }

  async findByUser(userId: string): Promise<Organisation[]> {
    const organisation = await this.organisationRepository
      .createQueryBuilder('organisation')
      .innerJoin('organisation.users', 'user')
      .where('user.userId = :userId', { userId })
      .getMany();

      if (!organisation) {
        throw new NotFoundException('Organisation not found');
      }

      return organisation
  }

  async findById(orgId: string): Promise<Organisation> {
    const organisation = await this.organisationRepository.findOne({ where: { orgId }});
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    return organisation;
  }

  async addUser(orgId: string, user: User) {
    const organisation = await this.organisationRepository.findOne({ where: { orgId }, relations: ['users']})
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    organisation.users = [...organisation.users, ...[user]];

    return await this.organisationRepository.save(organisation)
  }
}
