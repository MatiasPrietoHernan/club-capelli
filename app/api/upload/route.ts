// app/api/upload/route
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/s3";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
     const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "falta file" }, { status: 400 });

    const allowed = ["image/jpeg","image/png","image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "formato no permitido" }, { status: 415 });
    }

    const key = `public/${Date.now()}-${file.name.replace(/\s+/g,"_")}`;
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: file.type,
    }));

    const publicUrl = `${process.env.MINIO_ENDPOINT}/${BUCKET}/${key}`;
    return NextResponse.json({ ok: true, key, publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error subiendo imagen" }, { status: 500 });
  }
}