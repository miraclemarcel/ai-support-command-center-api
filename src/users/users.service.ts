import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Injectable() export class UsersService { constructor(private prisma: PrismaService) {} list(orgId: string) { return this.prisma.user.findMany({ where:{ organizationId: orgId }, select:{ id:true, fullName:true, email:true, role:true, isActive:true, createdAt:true }}); } }
