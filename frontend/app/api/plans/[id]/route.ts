import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/plans/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id },
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
              },
            },
          },
        },
        companies: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}

// PUT /api/plans/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

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
    } = body;

    // Check if plan exists
    const existing = await prisma.plan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Validate prices
    if (monthlyPriceCents !== undefined && monthlyPriceCents < 0) {
      return NextResponse.json(
        { error: 'Monthly price cannot be negative' },
        { status: 400 }
      );
    }

    if (yearlyPriceCents !== undefined && yearlyPriceCents < 0) {
      return NextResponse.json(
        { error: 'Yearly price cannot be negative' },
        { status: 400 }
      );
    }

    // Check slug uniqueness if changing
    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.plan.findUnique({ where: { slug } });
      if (duplicate) {
        return NextResponse.json(
          { error: 'Plan with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update plan
    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(monthlyPriceCents !== undefined && { monthlyPriceCents }),
        ...(yearlyPriceCents !== undefined && { yearlyPriceCents }),
        ...(yearlyDiscountPercent !== undefined && { yearlyDiscountPercent }),
        ...(companyTypeId !== undefined && { companyTypeId }),
        ...(isPopular !== undefined && { isPopular }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
      include: {
        companyType: true,
        planServices: {
          include: {
            service: {
              include: {
                features: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        companies: true,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check if plan is assigned to any companies
    if (plan.companies.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete plan that is assigned to companies' },
        { status: 400 }
      );
    }

    await prisma.plan.delete({ where: { id } });

    return NextResponse.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    );
  }
}
