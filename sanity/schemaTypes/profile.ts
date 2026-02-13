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
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'resume',
            title: 'Resume URL',
            type: 'file',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'object',
            fields: [
                {
                    name: 'github',
                    title: 'Github URL',
                    type: 'url',
                    initialValue: 'https://github.com/',
                },
                {
                    name: 'linkedin',
                    title: 'Linkedin URL',
                    type: 'url',
                    initialValue: 'https://linkedin.com/in/',
                },
                {
                    name: 'twitter',
                    title: 'Twitter URL',
                    type: 'url',
                    initialValue: 'https://twitter.com/',
                },
                {
                    name: 'twitch',
                    title: 'Twitch URL',
                    type: 'url',
                    initialValue: 'https://twitch.com/',
                },
            ],
        }),
        defineField({
            name: 'skills',
            title: 'Skills',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
})
