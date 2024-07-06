import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { Organisation } from 'src/core';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Organisation]), 
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    PassportModule],
  
  providers: [OrganisationService],
  controllers: [OrganisationController],
  exports: [OrganisationService],
})
export class OrganisationModule {}
