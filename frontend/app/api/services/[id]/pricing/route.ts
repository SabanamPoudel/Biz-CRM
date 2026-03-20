import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/services/[id]/pricing
// Upsert pricing for all company types
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const body = await request.json();
    const { pricing } = body;

    if (!Array.isArray(pricing)) {
      return NextResponse.json(
        { error: 'Pricing must be an array' },
        { status: 400 }
      );
    }

    // Validate pricing data
    for (const p of pricing) {
      if (!p.companyTypeId || typeof p.priceCents !== 'number') {
        return NextResponse.json(
          { error: 'Each pricing item must have companyTypeId and priceCents' },
          { status: 400 }
        );
      }

      if (p.priceCents < 0) {
        return NextResponse.json(
          { error: 'Price cannot be negative' },
          { status: 400 }
        );
      }

      // Verify company type exists
      const companyType = await prisma.companyType.findUnique({
        where: { id: p.companyTypeId },
      });

      if (!companyType) {
        return NextResponse.json(
          { error: `Company type ${p.companyTypeId} not found` },
          { status: 404 }
        );
      }
    }

    // Delete all existing pricing for this service
    await prisma.serviceCompanyPricing.deleteMany({
      where: { serviceId: id },
    });

    // Create new pricing records
    if (pricing.length > 0) {
      await prisma.serviceCompanyPricing.createMany({
        data: pricing.map((p: any) => ({
          serviceId: id,
          companyTypeId: p.companyTypeId,
          priceCents: p.priceCents,
        })),
      });
    }

    // Fetch updated pricing with company type info
    const updatedPricing = await prisma.serviceCompanyPricing.findMany({
      where: { serviceId: id },
      include: {
        companyType: true,
      },
      orderBy: {
        companyType: {
          sortOrder: 'asc',
        },
      },
    });

    return NextResponse.json(updatedPricing);
  } catch (error) {
    console.error('Error updating service pricing:', error);
    return NextResponse.json(
      { error: 'Failed to update service pricing' },
      { status: 500 }
    );
  }
}
