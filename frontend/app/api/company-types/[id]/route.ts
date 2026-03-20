import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/company-types/[id]
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

    const companyType = await prisma.companyType.findUnique({
      where: { id },
      include: {
        servicePricing: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!companyType) {
      return NextResponse.json({ error: 'Company type not found' }, { status: 404 });
    }

    return NextResponse.json(companyType);
  } catch (error) {
    console.error('Error fetching company type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company type' },
      { status: 500 }
    );
  }
}

// PUT /api/company-types/[id]
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
    const { name, slug, description, advantages, disadvantages, sortOrder, isActive } = body;

    // Check if exists
    const existing = await prisma.companyType.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Company type not found' }, { status: 404 });
    }

    // Check for duplicate name/slug (excluding current record)
    if (name || slug) {
      const duplicate = await prisma.companyType.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                name ? { name } : {},
                slug ? { slug } : {},
              ].filter(obj => Object.keys(obj).length > 0),
            },
          ],
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Company type with this name or slug already exists' },
          { status: 409 }
        );
      }
    }

    const companyType = await prisma.companyType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(advantages !== undefined && { advantages }),
        ...(disadvantages !== undefined && { disadvantages }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(companyType);
  } catch (error) {
    console.error('Error updating company type:', error);
    return NextResponse.json(
      { error: 'Failed to update company type' },
      { status: 500 }
    );
  }
}

// DELETE /api/company-types/[id]
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

    // Check if company type exists
    const companyType = await prisma.companyType.findUnique({
      where: { id },
      include: {
        servicePricing: true,
      },
    });

    if (!companyType) {
      return NextResponse.json({ error: 'Company type not found' }, { status: 404 });
    }

    // Check if it's being used
    if (companyType.servicePricing.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete company type that has pricing configured' },
        { status: 400 }
      );
    }

    await prisma.companyType.delete({ where: { id } });

    return NextResponse.json({ message: 'Company type deleted successfully' });
  } catch (error) {
    console.error('Error deleting company type:', error);
    return NextResponse.json(
      { error: 'Failed to delete company type' },
      { status: 500 }
    );
  }
}
