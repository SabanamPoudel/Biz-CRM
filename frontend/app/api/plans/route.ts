import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/plans - Fetch all plans with optional company type filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyTypeId = searchParams.get('company_type_id');

    const whereClause: any = {};
    
    // Filter by company type if provided
    if (companyTypeId) {
      whereClause.companyTypeId = parseInt(companyTypeId);
    }

    const plans = await prisma.plan.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
      include: {
        companyType: true,
        planServices: {
          include: {
            service: {
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
                },
              },
            },
          },
        },
        _count: {
          select: {
            companies: true,
          },
        },
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

// POST /api/plans
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      type,
      monthlyPriceCents,
      yearlyPriceCents,
      yearlyDiscountPercent,
      companyTypeId,
      isPopular,
      isActive,
      sortOrder,
      services,
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await prisma.plan.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'Plan with this slug already exists' },
        { status: 409 }
      );
    }

    // Create plan
    const plan = await prisma.plan.create({
      data: {
        name,
        slug,
        description: description || null,
        monthlyPriceCents: monthlyPriceCents || 0,
        yearlyPriceCents: yearlyPriceCents || 0,
        yearlyDiscountPercent: yearlyDiscountPercent !== undefined ? yearlyDiscountPercent : 20,
        companyTypeId: companyTypeId || null,
        isPopular: isPopular !== undefined ? isPopular : false,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
      },
    });

    // Add services if provided
    if (services && Array.isArray(services) && services.length > 0) {
      // Validate all service IDs exist
      for (const serviceId of services) {
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
        });
        if (!service) {
          // Rollback: delete the created plan
          await prisma.plan.delete({ where: { id: plan.id } });
          return NextResponse.json(
            { error: `Service ${serviceId} not found` },
            { status: 404 }
          );
        }
      }

      // Create plan-service links
      await prisma.planService.createMany({
        data: services.map((serviceId: number) => ({
          planId: plan.id,
          serviceId,
        })),
      });
    }

    // Fetch created plan with company type and services
    const createdPlan = await prisma.plan.findUnique({
      where: { id: plan.id },
      include: {
        companyType: true,
        planServices: true,
      },
    });

    return NextResponse.json(createdPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
