import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateArticleDto, SearchKnowledgeDto } from './dto';
@Injectable() export class KnowledgeBaseService { constructor(private prisma:PrismaService, private ai:AiService){}
 private chunk(text:string){ return text.match(/(.|\n){1,900}/g) || [text]; }
 async create(orgId:string,dto:CreateArticleDto){ const article=await this.prisma.knowledgeArticle.create({data:{organizationId:orgId,...dto}}); for(const content of this.chunk(dto.content)){ const embedding=await this.ai.embed(content); await this.prisma.knowledgeChunk.create({data:{articleId:article.id,content,embedding,tokenCount:content.split(' ').length}}); } return this.get(article.id); }
 list(orgId:string){ return this.prisma.knowledgeArticle.findMany({where:{organizationId:orgId},orderBy:{createdAt:'desc'}}); }
 get(id:string){ return this.prisma.knowledgeArticle.findUnique({where:{id},include:{chunks:true}}); }
 async search(orgId:string,dto:SearchKnowledgeDto){ const articles=await this.prisma.knowledgeArticle.findMany({where:{organizationId:orgId,isPublished:true},include:{chunks:true}}); const q=dto.query.toLowerCase(); return articles.flatMap(a=>a.chunks.map(c=>({articleId:a.id,title:a.title,category:a.category,content:c.content,score:c.content.toLowerCase().includes(q)?0.95:0.45}))).sort((a,b)=>b.score-a.score).slice(0,5); }
}
