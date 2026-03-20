import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/services - List all services with full details
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' },
        },
        categories: {
          include: {
            category: true,
          },
        },
        pricing: {
          include: {
            companyType: true,
          },
          orderBy: {
            companyType: {
              sortOrder: 'asc',
            },
          },
        },
        _count: {
          select: { planServices: true },
        },
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      type,
      billingInterval,
      features,
      categories,
      pricing,
      isActive,
      sortOrder,
    } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    if (type && !['BASE', 'ADDON'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid service type. Must be BASE or ADDON' },
        { status: 400 }
      );
    }

    if (billingInterval && !['ONE_TIME', 'MONTHLY', 'YEARLY'].includes(billingInterval)) {
      return NextResponse.json(
        { error: 'Invalid billing interval. Must be ONE_TIME, MONTHLY, or YEARLY' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await prisma.service.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Service with this slug already exists' },
        { status: 409 }
      );
    }

    // Create service with nested relations
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description: description || null,
        type: type || 'BASE',
        billingInterval: billingInterval || 'ONE_TIME',
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
        // Create features if provided
        ...(features && features.length > 0 && {
          features: {
            create: features.map((f: any, index: number) => ({
              name: f.name,
              description: f.description || null,
              sortOrder: f.sortOrder !== undefined ? f.sortOrder : index,
            })),
          },
        }),
        // Link categories if provided
        ...(categories && categories.length > 0 && {
          categories: {
            create: categories.map((categoryId: number) => ({
              categoryId,
            })),
          },
        }),
        // Create pricing if provided
        ...(pricing && pricing.length > 0 && {
          pricing: {
            create: pricing.map((p: any) => ({
              companyTypeId: p.companyTypeId,
              priceCents: p.priceCents,
              currency: p.currency || 'USD',
            })),
          },
        }),
      },
      include: {
        features: true,
        categories: {
          include: {
            category: true,
          },
        },
        pricing: {
          include: {
            companyType: true,
          },
        },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
