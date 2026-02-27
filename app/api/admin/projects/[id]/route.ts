import {
    deleteAdminProject,
    getAdminProjectById,
    updateAdminProject,
    type AdminProjectInput,
} from "@/lib/admin-projects";
import { requireAdminSession } from "@/lib/require-admin-session";

type RouteContext = {
    params: Promise<{ id: string }>;
};

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return "Unknown error";
}

async function getProjectId(context: RouteContext) {
    const { id } = await context.params;
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
        return null;
    }
    return parsedId;
}

export async function GET(_request: Request, context: RouteContext) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = await getProjectId(context);
    if (!projectId) {
        return Response.json({ error: "Invalid project id" }, { status: 400 });
    }

    const project = await getAdminProjectById(projectId);
    if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({ project });
}

export async function PUT(request: Request, context: RouteContext) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = await getProjectId(context);
    if (!projectId) {
        return Response.json({ error: "Invalid project id" }, { status: 400 });
    }

    try {
        const body = (await request.json()) as AdminProjectInput;
        const project = await updateAdminProject(projectId, body);
        return Response.json({ project });
    } catch (error) {
        const message = getErrorMessage(error);
        if (message.includes("Duplicate") || message.includes("unique") || message.includes("slug")) {
            return Response.json({ error: "Slug already exists" }, { status: 409 });
        }
        if (message.includes("not found")) {
            return Response.json({ error: "Project not found" }, { status: 404 });
        }
        return Response.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(_request: Request, context: RouteContext) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = await getProjectId(context);
    if (!projectId) {
        return Response.json({ error: "Invalid project id" }, { status: 400 });
    }

    const deleted = await deleteAdminProject(projectId);
    if (!deleted) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    return Response.json({ success: true });
}
