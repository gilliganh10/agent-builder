import { NextResponse } from "next/server";

/**
 * Public chat message actions are backed by the "learning opportunity"
 * workflow which is not part of this OSS build. The route is kept so that
 * embedded chat widgets posting here get a clean 501 instead of a 404.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Message actions are not supported in this build." },
    { status: 501 },
  );
}
