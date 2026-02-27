import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {

  try {

    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "SUPER") {

      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );

    }

    const admins = await prisma.user.findMany({

      where: {
        rol: "ADMIN"
      },

      include: {
        sucursal: true
      },

      orderBy: {
        createdAt: "desc"
      }

    });

    return NextResponse.json({
      admins
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );

  }

}
