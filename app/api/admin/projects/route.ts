import { createAdminProject, listAdminProjects, type AdminProjectInput } from "@/lib/admin-projects";
import { requireAdminSession } from "@/lib/require-admin-session";

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return "Unknown error";
}

export async function GET() {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const projects = await listAdminProjects();
        return Response.json({ projects });
    } catch (error) {
        return Response.json({ error: getErrorMessage(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await request.json()) as AdminProjectInput;
        const project = await createAdminProject(body);
        return Response.json({ project }, { status: 201 });
    } catch (error) {
        const message = getErrorMessage(error);
        if (message.includes("Duplicate") || message.includes("unique") || message.includes("slug")) {
            return Response.json({ error: "Slug already exists" }, { status: 409 });
        }

        return Response.json({ error: message }, { status: 400 });
    }
}
