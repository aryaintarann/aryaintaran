import { defineField, defineType } from 'sanity'

export const contact = defineType({
    name: 'contact',
    title: 'Contact',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Section Title',
            type: 'string',
            initialValue: 'Get In Touch',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            initialValue: "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
        }),
        defineField({
            name: 'email',
            title: 'Contact Email',
            type: 'string',
            description: 'Leave empty to use the email from Profile.',
        }),
        defineField({
            name: 'whatsapp',
            title: 'WhatsApp Number',
            type: 'string',
            description: 'e.g., +6281234567890',
        }),
        defineField({
            name: 'linkedin',
            title: 'LinkedIn URL',
            type: 'url',
            initialValue: 'https://linkedin.com/in/',
        }),
        defineField({
            name: 'github',
            title: 'GitHub URL',
            type: 'url',
            initialValue: 'https://github.com/',
        }),
        defineField({
            name: 'instagram',
            title: 'Instagram URL',
            type: 'url',
            initialValue: 'https://instagram.com/',
        }),
    ],
})
