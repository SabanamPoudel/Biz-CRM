import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Company Types
  console.log('Creating Company Types...');
  const llc = await prisma.companyType.upsert({
    where: { slug: 'llc' },
    update: {},
    create: {
      name: 'LLC',
      slug: 'llc',
      description: 'Limited Liability Company - Most popular business structure',
      advantages: [
        'Limited personal liability',
        'Pass-through taxation',
        'Flexible management structure',
        'Less paperwork than corporations',
      ],
      disadvantages: [
        'Self-employment taxes',
        'Limited fundraising options',
        'Varying state regulations',
      ],
      isActive: true,
      sortOrder: 0,
    },
  });

  const sCorp = await prisma.companyType.upsert({
    where: { slug: 's-corp' },
    update: {},
    create: {
      name: 'S-Corp',
      slug: 's-corp',
      description: 'S Corporation - Tax-efficient structure for small businesses',
      advantages: [
        'Tax savings on self-employment',
        'Pass-through taxation',
        'Limited liability protection',
        'Enhanced business credibility',
      ],
      disadvantages: [
        'Strict IRS requirements',
        'Limited to 100 shareholders',
        'Required reasonable salary',
        'More administrative requirements',
      ],
      isActive: true,
      sortOrder: 1,
    },
  });

  const cCorp = await prisma.companyType.upsert({
    where: { slug: 'c-corp' },
    update: {},
    create: {
      name: 'C-Corp',
      slug: 'c-corp',
      description: 'C Corporation - Best for raising capital and going public',
      advantages: [
        'Unlimited shareholders',
        'Easier to raise capital',
        'No restrictions on ownership',
        'Potential for going public',
      ],
      disadvantages: [
        'Double taxation',
        'More regulations and paperwork',
        'Higher compliance costs',
        'Less flexibility',
      ],
      isActive: true,
      sortOrder: 2,
    },
  });

  console.log(`Created Company Types: ${llc.name}, ${sCorp.name}, ${cCorp.name}`);

  // Create Categories
  console.log('Creating Categories...');
  const formation = await prisma.category.upsert({
    where: { slug: 'formation' },
    update: {},
    create: {
      name: 'Formation',
      slug: 'formation',
      description: 'Business formation and setup services',
      icon: '🏢',
      isActive: true,
      sortOrder: 0,
    },
  });

  const compliance = await prisma.category.upsert({
    where: { slug: 'compliance' },
    update: {},
    create: {
      name: 'Compliance',
      slug: 'compliance',
      description: 'Ongoing compliance and regulatory services',
      icon: '📋',
      isActive: true,
      sortOrder: 1,
    },
  });

  const tax = await prisma.category.upsert({
    where: { slug: 'tax-services' },
    update: {},
    create: {
      name: 'Tax Services',
      slug: 'tax-services',
      description: 'Tax filing and planning services',
      icon: '💰',
      isActive: true,
      sortOrder: 2,
    },
  });

  const addons = await prisma.category.upsert({
    where: { slug: 'add-ons' },
    update: {},
    create: {
      name: 'Add-ons',
      slug: 'add-ons',
      description: 'Additional services and add-ons',
      icon: '⚡',
      isActive: true,
      sortOrder: 3,
    },
  });

  console.log(`Created Categories: ${formation.name}, ${compliance.name}, ${tax.name}, ${addons.name}`);

  // Create Services
  console.log('Creating Services...');
  const businessFormation = await prisma.service.upsert({
    where: { slug: 'business-formation' },
    update: {},
    create: {
      name: 'Business Formation',
      slug: 'business-formation',
      description: 'Complete business formation package including state filing',
      type: 'BASE',
      billingInterval: 'ONE_TIME',
      isActive: true,
      sortOrder: 0,
      features: {
        create: [
          {
            name: 'EIN Acquisition',
            description: 'Federal Employer Identification Number from IRS',
            sortOrder: 0,
          },
          {
            name: 'State Filing',
            description: 'Articles of Organization/Incorporation filing',
            sortOrder: 1,
          },
          {
            name: 'Operating Agreement',
            description: 'Customized operating agreement or bylaws',
            sortOrder: 2,
          },
          {
            name: 'Certificate of Formation',
            description: 'Official state certificate',
            sortOrder: 3,
          },
        ],
      },
      categories: {
        create: [{ categoryId: formation.id }],
      },
      pricing: {
        create: [
          { companyTypeId: llc.id, priceCents: 29900 },
          { companyTypeId: sCorp.id, priceCents: 49900 },
          { companyTypeId: cCorp.id, priceCents: 69900 },
        ],
      },
    },
  });

  const annualReport = await prisma.service.upsert({
    where: { slug: 'annual-report-filing' },
    update: {},
    create: {
      name: 'Annual Report Filing',
      slug: 'annual-report-filing',
      description: 'State-required annual report preparation and filing',
      type: 'BASE',
      billingInterval: 'YEARLY',
      isActive: true,
      sortOrder: 1,
      features: {
        create: [
          {
            name: 'Report Preparation',
            description: 'Complete annual report preparation',
            sortOrder: 0,
          },
          {
            name: 'State Filing',
            description: 'Filing with state authorities',
            sortOrder: 1,
          },
          {
            name: 'Compliance Monitoring',
            description: 'Track deadlines and requirements',
            sortOrder: 2,
          },
        ],
      },
      categories: {
        create: [{ categoryId: compliance.id }],
      },
      pricing: {
        create: [
          { companyTypeId: llc.id, priceCents: 9900 },
          { companyTypeId: sCorp.id, priceCents: 14900 },
          { companyTypeId: cCorp.id, priceCents: 19900 },
        ],
      },
    },
  });

  const registeredAgent = await prisma.service.upsert({
    where: { slug: 'registered-agent' },
    update: {},
    create: {
      name: 'Registered Agent Service',
      slug: 'registered-agent',
      description: 'Professional registered agent service in all 50 states',
      type: 'BASE',
      billingInterval: 'YEARLY',
      isActive: true,
      sortOrder: 2,
      features: {
        create: [
          {
            name: 'Legal Document Receipt',
            description: 'Receive legal and tax documents',
            sortOrder: 0,
          },
          {
            name: 'Instant Notifications',
            description: 'Email and SMS alerts',
            sortOrder: 1,
          },
          {
            name: 'Digital Dashboard',
            description: 'Online document access',
            sortOrder: 2,
          },
        ],
      },
      categories: {
        create: [{ categoryId: compliance.id }],
      },
      pricing: {
        create: [
          { companyTypeId: llc.id, priceCents: 12900 },
          { companyTypeId: sCorp.id, priceCents: 12900 },
          { companyTypeId: cCorp.id, priceCents: 12900 },
        ],
      },
    },
  });

  const expeditedEin = await prisma.service.upsert({
    where: { slug: 'expedited-ein' },
    update: {},
    create: {
      name: 'Expedited EIN',
      slug: 'expedited-ein',
      description: 'Get your EIN in 1-2 business days instead of 2-3 weeks',
      type: 'ADDON',
      billingInterval: 'ONE_TIME',
      isActive: true,
      sortOrder: 3,
      features: {
        create: [
          {
            name: 'Fast Processing',
            description: '1-2 business days delivery',
            sortOrder: 0,
          },
          {
            name: 'Priority Support',
            description: 'Dedicated support team',
            sortOrder: 1,
          },
        ],
      },
      categories: {
        create: [{ categoryId: addons.id }],
      },
      pricing: {
        create: [
          { companyTypeId: llc.id, priceCents: 7900 },
          { companyTypeId: sCorp.id, priceCents: 7900 },
          { companyTypeId: cCorp.id, priceCents: 7900 },
        ],
      },
    },
  });

  console.log(`Created Services: ${businessFormation.name}, ${annualReport.name}, ${registeredAgent.name}, ${expeditedEin.name}`);

  // Create Plans
  console.log('Creating Plans...');
  const starter = await prisma.plan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      name: 'Starter',
      slug: 'starter',
      description: 'Essential services for new businesses',
      monthlyPriceCents: 0,
      yearlyPriceCents: 0,
      isPopular: false,
      isActive: true,
      sortOrder: 0,
      planServices: {
        create: [
          { serviceId: businessFormation.id },
        ],
      },
    },
  });

  const growth = await prisma.plan.upsert({
    where: { slug: 'growth' },
    update: {},
    create: {
      name: 'Growth',
      slug: 'growth',
      description: 'Complete package for growing businesses',
      monthlyPriceCents: 0,
      yearlyPriceCents: 19900,
      isPopular: true,
      isActive: true,
      sortOrder: 1,
      planServices: {
        create: [
          { serviceId: businessFormation.id },
          { serviceId: registeredAgent.id },
          { serviceId: annualReport.id },
        ],
      },
    },
  });

  const premium = await prisma.plan.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
      name: 'Premium',
      slug: 'premium',
      description: 'All-inclusive service package',
      monthlyPriceCents: 0,
      yearlyPriceCents: 29900,
      isPopular: false,
      isActive: true,
      sortOrder: 2,
      planServices: {
        create: [
          { serviceId: businessFormation.id },
          { serviceId: registeredAgent.id },
          { serviceId: annualReport.id },
          { serviceId: expeditedEin.id },
        ],
      },
    },
  });

  console.log(`Created Plans: ${starter.name}, ${growth.name}, ${premium.name}`);

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
