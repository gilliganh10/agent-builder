import { NextResponse } from "next/server";

/**
 * Message actions in the monolith are backed by the "learning opportunity"
 * workflow which is not part of this OSS build. The route still exists so
 * client components that post here during chat don't surface a 404, but it
 * returns a clear 501 response that UIs can ignore.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Message actions are not supported in this build." },
    { status: 501 },
  );
}
