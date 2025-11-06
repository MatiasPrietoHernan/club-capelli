// app/api/get-token/route.ts
import { validateTokenDB } from "@/lib/validateTokenDB";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return new Response("Missing ID", { status: 400 });

  const token = await validateTokenDB(id);

  if(!token) return NextResponse.json({error:"Error en validar token"},{status:401})

  return Response.json({ token });
}
