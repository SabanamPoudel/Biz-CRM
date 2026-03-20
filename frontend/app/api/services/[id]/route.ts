import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/services/[id]
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

    const service = await prisma.service.findUnique({
      where: { id },
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
        planServices: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id]
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
      billingInterval,
      features,
      categories,
      isActive,
      sortOrder,
    } = body;

    // Check if service exists
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Validate enums
    if (type && !['BASE', 'ADDON'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
    }

    if (billingInterval && !['ONE_TIME', 'MONTHLY', 'YEARLY'].includes(billingInterval)) {
      return NextResponse.json(
        { error: 'Invalid billing interval' },
        { status: 400 }
      );
    }

    // Check slug uniqueness if changing
    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.service.findUnique({ where: { slug } });
      if (duplicate) {
        return NextResponse.json(
          { error: 'Service with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update service
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(billingInterval && { billingInterval }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    // Update features if provided
    if (features !== undefined) {
      // Delete existing features
      await prisma.serviceFeature.deleteMany({
        where: { serviceId: id },
      });

      // Create new features
      if (features.length > 0) {
        await prisma.serviceFeature.createMany({
          data: features.map((f: any, index: number) => ({
            serviceId: id,
            name: f.name,
            description: f.description || null,
            sortOrder: f.sortOrder !== undefined ? f.sortOrder : index,
          })),
        });
      }
    }

    // Update categories if provided
    if (categories !== undefined) {
      // Delete existing category links
      await prisma.serviceCategory.deleteMany({
        where: { serviceId: id },
      });

      // Create new category links
      if (categories.length > 0) {
        await prisma.serviceCategory.createMany({
          data: categories.map((categoryId: number) => ({
            serviceId: id,
            categoryId,
          })),
        });
      }
    }

    // Fetch updated service with relations
    const updatedService = await prisma.service.findUnique({
      where: { id },
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
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id]
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

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        planServices: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check if service is used in any plans
    if (service.planServices.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service that is included in plans' },
        { status: 400 }
      );
    }

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
