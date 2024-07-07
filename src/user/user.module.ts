import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../core';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => OrganisationModule),

    PassportModule
],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
