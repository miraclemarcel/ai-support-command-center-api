import { IsOptional, IsString } from 'class-validator';
export class CreateArticleDto { @IsString() title:string; @IsString() content:string; @IsOptional() @IsString() category?:string; }
export class SearchKnowledgeDto { @IsString() query:string; }
