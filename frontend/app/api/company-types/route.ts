import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/company-types - List all company types
export async function GET() {
  try {
    const companyTypes = await prisma.companyType.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(companyTypes);
  } catch (error) {
    console.error('Error fetching company types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company types' },
      { status: 500 }
    );
  }
}

// POST /api/company-types - Create a new company type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, advantages, disadvantages, sortOrder, isActive } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existing = await prisma.companyType.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Company type with this name or slug already exists' },
        { status: 409 }
      );
    }

    const companyType = await prisma.companyType.create({
      data: {
        name,
        slug,
        description: description || null,
        advantages: advantages || null,
        disadvantages: disadvantages || null,
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(companyType, { status: 201 });
  } catch (error) {
    console.error('Error creating company type:', error);
    return NextResponse.json(
      { error: 'Failed to create company type' },
      { status: 500 }
    );
  }
}
