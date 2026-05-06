import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator'; import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateArticleDto, SearchKnowledgeDto } from './dto'; import { KnowledgeBaseService } from './knowledge-base.service';
@ApiTags('Knowledge Base') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('knowledge-base') export class KnowledgeBaseController { constructor(private service:KnowledgeBaseService){} @Post('articles') create(@CurrentUser()u:any,@Body()d:CreateArticleDto){return this.service.create(u.organizationId,d)} @Get('articles') list(@CurrentUser()u:any){return this.service.list(u.organizationId)} @Post('search') search(@CurrentUser()u:any,@Body()d:SearchKnowledgeDto){return this.service.search(u.organizationId,d)} }
