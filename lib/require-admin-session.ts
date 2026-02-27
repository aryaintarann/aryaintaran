import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function requireAdminSession() {
    let session = null;
    try {
        session = await getServerSession(authOptions);
    } catch {
        session = null;
    }

    if (!session) {
        return null;
    }

    return session;
}
