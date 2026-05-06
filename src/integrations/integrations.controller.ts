import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Integrations') @Controller('integrations') export class IntegrationsController { @Post('whatsapp/webhook') whatsapp(@Body() body:any){ return {received:true,provider:'whatsapp',body}; } @Post('email/inbound') email(@Body() body:any){ return {received:true,provider:'email',body}; } }
