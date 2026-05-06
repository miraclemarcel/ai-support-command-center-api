import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const org = await prisma.organization.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: { name: 'Demo Company', slug: 'demo-company' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      organizationId: org.id,
      fullName: 'Demo Admin',
      email: 'admin@demo.com',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.customer.create({
    data: {
      organizationId: org.id,
      fullName: 'Ada Customer',
      email: 'ada@example.com',
      phone: '+2348012345678',
      country: 'Nigeria',
      notes: 'Demo customer for support workflows.',
    },
  });

  const article = await prisma.knowledgeArticle.create({
    data: {
      organizationId: org.id,
      title: 'Refund Policy',
      category: 'Billing',
      content: 'Customers can request refunds within 7 days if the service has not been fully delivered. Escalate urgent refund disputes to a manager.',
    },
  });

  await prisma.knowledgeChunk.create({
    data: {
      articleId: article.id,
      content: article.content,
      tokenCount: article.content.split(' ').length,
    },
  });

  await prisma.conversation.create({
    data: {
      organizationId: org.id,
      customerId: customer.id,
      channel: 'WEB_CHAT',
      status: 'BOT_HANDLING',
      subject: 'Refund question',
      messages: {
        create: {
          senderType: 'CUSTOMER',
          body: 'Please, I need help with my refund.',
        },
      },
    },
  });

  console.log('Seed complete: admin@demo.com / Password123!');
}

main().finally(async () => prisma.$disconnect());
