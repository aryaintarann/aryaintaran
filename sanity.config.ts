import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

// Use environment variables for project ID and dataset
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
    basePath: '/studio', // This matches the route we will create
    projectId,
    dataset,
    // Add and edit the content schema in the './sanity/schema' folder
    schema: {
        types: schemaTypes,
    },
    plugins: [
        structureTool(),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: '2024-02-12' }),
    ],
})
