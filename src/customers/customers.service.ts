import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
@Injectable() export class CustomersService { constructor(private prisma:PrismaService){}
 create(orgId:string,dto:CreateCustomerDto){ return this.prisma.customer.create({data:{organizationId:orgId,...dto}}); }
 list(orgId:string){ return this.prisma.customer.findMany({where:{organizationId:orgId},orderBy:{createdAt:'desc'}}); }
 async get(orgId:string,id:string){ const c=await this.prisma.customer.findFirst({where:{id,organizationId:orgId},include:{conversations:true,tickets:true}}); if(!c) throw new NotFoundException('Customer not found'); return c; }
 update(orgId:string,id:string,dto:UpdateCustomerDto){ return this.prisma.customer.update({where:{id},data:dto}); }
}
