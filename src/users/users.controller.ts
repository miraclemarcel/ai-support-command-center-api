import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
@ApiTags('Users') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('users') export class UsersController { constructor(private users: UsersService){} @Get() list(@CurrentUser() user:any){ return this.users.list(user.organizationId); } }
