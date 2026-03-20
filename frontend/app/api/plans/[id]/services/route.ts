import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/plans/[id]/services
// Replace all services for a plan
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

    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const body = await request.json();
    const { serviceIds } = body;

    if (!Array.isArray(serviceIds)) {
      return NextResponse.json(
        { error: 'serviceIds must be an array' },
        { status: 400 }
      );
    }

    // Validate all service IDs exist
    for (const serviceId of serviceIds) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!service) {
        return NextResponse.json(
          { error: `Service ${serviceId} not found` },
          { status: 404 }
        );
      }
    }

    // Delete all existing plan-service links
    await prisma.planService.deleteMany({
      where: { planId: id },
    });

    // Create new plan-service links
    if (serviceIds.length > 0) {
      await prisma.planService.createMany({
        data: serviceIds.map((serviceId: number) => ({
          planId: id,
          serviceId,
        })),
      });
    }

    // Fetch updated plan with services
    const updatedPlan = await prisma.plan.findUnique({
      where: { id },
      include: {
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
    console.error('Error updating plan services:', error);
    return NextResponse.json(
      { error: 'Failed to update plan services' },
      { status: 500 }
    );
  }
}
