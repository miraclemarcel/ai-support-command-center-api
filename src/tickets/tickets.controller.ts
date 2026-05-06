import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator'; import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service'; import { CreateTicketDto, UpdateTicketDto } from './dto';
@ApiTags('Tickets') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('tickets') export class TicketsController { constructor(private service:TicketsService){} @Post() create(@CurrentUser()u:any,@Body()d:CreateTicketDto){return this.service.create(u.organizationId,d)} @Get() list(@CurrentUser()u:any){return this.service.list(u.organizationId)} @Get(':id') get(@CurrentUser()u:any,@Param('id')id:string){return this.service.get(u.organizationId,id)} @Patch(':id') update(@CurrentUser()u:any,@Param('id')id:string,@Body()d:UpdateTicketDto){return this.service.update(u.organizationId,id,d)} }
