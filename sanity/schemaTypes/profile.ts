import { defineField, defineType } from 'sanity'

export const profile = defineType({
    name: 'profile',
    title: 'Profile',
    type: 'document',
    fields: [
        defineField({
            name: 'fullName',
            title: 'Full Name',
            type: 'string',
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'In one short sentence what do you do?',
        }),
        defineField({
            name: 'profileImage',
            title: 'Profile Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    title: 'Alt',
                    type: 'string',
                },
            ],
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            description: "Dedicated image for the Hero section. Falls back to Profile Image if not set.",
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    title: 'Alt',
                    type: 'string',
                },
            ],
        }),
        defineField({
            name: 'shortBio',
            title: 'Short Bio',
            type: 'text',
        }),
        defineField({
            name: 'email',
            title: 'Email Address',
            type: 'string',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),
        defineField({
            name: 'fullBio',
            title: 'Full Bio',
            type: 'array',
            of: [{
                type: 'block',
                styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'H3', value: 'h3' },
                    { title: 'H4', value: 'h4' },
                    { title: 'Quote', value: 'blockquote' },
                    { title: 'Justify', value: 'justify' },
                    { title: 'Center', value: 'center' },
                    { title: 'Right', value: 'right' },
                ]
            }],
        }),
        defineField({
            name: 'resume',
            title: 'Resume URL',
            type: 'file',
        }),
        defineField({
            name: 'portfolio',
            title: 'Portfolio PDF',
            type: 'file',
            description: 'Upload your portfolio PDF manually here.',
        }),

        defineField({
            name: 'skills',
            title: 'Skills',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
})
