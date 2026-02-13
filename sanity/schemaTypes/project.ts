import { defineField, defineType } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'logo',
            title: 'Project Logo',
            type: 'image',
        }),
        defineField({
            name: 'image',
            title: 'Project Image',
            type: 'image',
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
        }),
        defineField({
            name: 'description',
            title: 'Full Description',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'link',
            title: 'Project Link',
            type: 'url',
        }),
        defineField({
            name: 'githubLink',
            title: 'GitHub Link',
            type: 'url',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
})
