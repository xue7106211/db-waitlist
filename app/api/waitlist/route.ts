import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请提供有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email },
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: '该邮箱地址已经在等候名单中' },
        { status: 400 }
      )
    }

    // 创建新的等候名单条目
    const entry = await prisma.waitlistEntry.create({
      data: { email },
    })

    return NextResponse.json(
      { message: '成功加入等候名单', entry },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist submission error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
} 