import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OrganisationService } from 'src/organisation/organisation.service';

@Injectable()
export class OrganisationMemberGuard implements CanActivate {
  constructor(
    private readonly organisationService: OrganisationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const targetUserId = request.params.id;

    if (!userId || !targetUserId) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    // Check if the user is accessing their own record
    if (userId === targetUserId) {
      return true;
    }

    // Get the organization(s) of the target user
    const targetUserOrganisations = await this.organisationService.findByUser(targetUserId);

    // Check if the requesting user is a member of or has created any of the target user's organizations
    const organisationsOfRequestingUser = await this.organisationService.findByUser(userId);

    const isAuthorized = organisationsOfRequestingUser.some(org =>
      targetUserOrganisations.some(targetOrg => 
        targetOrg.orgId === org.orgId
      )
    );

    if (!isAuthorized) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
