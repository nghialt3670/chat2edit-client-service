import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
import { logError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

    const chat = await prisma.chat.findFirstOrThrow({
      where: { id, accountId: session.user.id },
    });

    return NextResponse.json(chat.shareId);
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

    await prisma.chat.update({
      where: { id, accountId: session.user.id },
      data: {
        shareId: null,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

    const shareId = v4();
    await prisma.chat.update({
      where: { id, accountId: session.user.id },
      data: {
        shareId,
      },
    });

    return NextResponse.json(shareId);
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
