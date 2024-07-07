import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OrganisationMemberGuard } from '../../src/common';
import { OrganisationService } from '../../src/organisation/organisation.service';

describe('OrganisationMemberGuard', () => {
  let guard: OrganisationMemberGuard;
  let organisationService: OrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationMemberGuard,
        {
          provide: OrganisationService,
          useValue: {
            findByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<OrganisationMemberGuard>(OrganisationMemberGuard);
    organisationService = module.get<OrganisationService>(OrganisationService);
  });

  it('should allow access if user is accessing their own record', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { userId: 'user1' }, params: { id: 'user1' } }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access if users are in the same organisation', async () => {
    jest.spyOn(organisationService, 'findByUser').mockImplementation(userId => {
      if (userId === 'user1') {
        return Promise.resolve([{ orgId: 'org1' }]);
      }
      if (userId === 'user2') {
        return Promise.resolve([{ orgId: 'org1' }]);
      }
      return Promise.resolve([]);
    });

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { userId: 'user1' }, params: { id: 'user2' } }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access if users are not in the same organisation', async () => {
    jest.spyOn(organisationService, 'findByUser').mockImplementation(userId => {
      if (userId === 'user1') {
        return Promise.resolve([{ orgId: 'org1' }]);
      }
      if (userId === 'user2') {
        return Promise.resolve([{ orgId: 'org2' }]);
      }
      return Promise.resolve([]);
    });

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { userId: 'user1' }, params: { id: 'user2' } }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
