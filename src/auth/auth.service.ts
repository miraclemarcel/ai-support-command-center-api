import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto, RegisterDto } from './dto';

function slugify(input: string) { return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');
    const org = await this.prisma.organization.create({ data: { name: dto.organizationName, slug: `${slugify(dto.organizationName)}-${Date.now()}` } });
    const user = await this.prisma.user.create({
      data: { organizationId: org.id, fullName: dto.fullName, email: dto.email, passwordHash: await bcrypt.hash(dto.password, 10), role: dto.role || 'ADMIN' },
      select: { id: true, fullName: true, email: true, role: true, organizationId: true },
    });
    return { user, accessToken: this.sign(user.id) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account disabled');
    const safeUser = { id: user.id, fullName: user.fullName, email: user.email, role: user.role, organizationId: user.organizationId };
    return { user: safeUser, accessToken: this.sign(user.id) };
  }

  private sign(userId: string) { return this.jwt.sign({ sub: userId }); }
}
