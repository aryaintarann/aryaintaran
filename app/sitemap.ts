import { MetadataRoute } from 'next'
import { listPublishedProjectSlugs } from '@/lib/public-projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://aryaintaran.dev'

    let projects: Array<{ slug: string; updatedAt: string }> = []
    try {
        projects = await listPublishedProjectSlugs()
    } catch (error) {
        console.error('[mysql] sitemap project fetch failed', error)
    }

    const projectUrls = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/#about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/#projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/#contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...projectUrls,
    ]
}
