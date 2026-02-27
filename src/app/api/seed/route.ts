import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Seed not allowed in production" }, { status: 403 });
    }

    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const admin = await prisma.user.upsert({
            where: { email: "admin@genimpact.hr" },
            update: {},
            create: {
                email: "admin@genimpact.hr",
                name: "Admin GenImpact",
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        return NextResponse.json({ message: "Seed successful", admin }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
