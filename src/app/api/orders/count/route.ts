import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.order.count({
      where: {
        isViewed: false
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching order count:', error)
    return NextResponse.json({ error: 'Failed to fetch order count' }, { status: 500 })
  }
}
