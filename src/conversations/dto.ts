import { Channel, MessageSenderType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class CreateConversationDto { @IsString() customerId:string; @IsOptional() @IsEnum(Channel) channel?:Channel; @IsOptional() @IsString() subject?:string; @IsOptional() @IsString() firstMessage?:string; }
export class CreateMessageDto { @IsString() body:string; @IsOptional() @IsEnum(MessageSenderType) senderType?:MessageSenderType; }
export class TakeoverDto { @IsOptional() @IsString() note?:string; }
