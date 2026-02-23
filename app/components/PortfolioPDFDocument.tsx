import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';


const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff'
    },
    section: {
        margin: 10,
        padding: 10,
        borderBottom: '1px solid #eee'
    },
    header: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        color: '#0f172a'
    },
    subHeader: {
        fontSize: 18,
        marginTop: 15,
        marginBottom: 5,
        color: '#1e293b',
        borderBottom: '1px solid #ddd',
        paddingBottom: 5
    },
    text: {
        marginBottom: 5,
        fontSize: 12,
        lineHeight: 1.5,
        color: '#334155'
    },
    bold: {
        fontWeight: 'bold',
        color: '#0f172a'
    },
    projectTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a',
        marginTop: 10,
        marginBottom: 2
    },
    date: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 2
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    },
    tag: {
        fontSize: 9,
        backgroundColor: '#f1f5f9',
        padding: '2 6',
        borderRadius: 4,
        marginRight: 4,
        marginBottom: 4,
        color: '#475569'
    }
});

interface Props {
    data: {
        profile: any;
        education: any[];
        jobs: any[];
        projects: any[];
    }
}

export const PortfolioPDFDocument = ({ data }: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>

            <View style={styles.section}>
                <Text style={styles.header}>{data.profile?.fullName || 'Portfolio'}</Text>
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#475569' }}>
                    {data.profile?.headline}
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 10, marginTop: 5, color: '#64748b' }}>
                    {data.profile?.email} | {data.profile?.location}
                </Text>
                <Text style={{ marginTop: 15, fontSize: 12, lineHeight: 1.5 }}>
                    {data.profile?.shortBio}
                </Text>
            </View>

            {data.jobs && data.jobs.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Experience</Text>
                    {data.jobs.map((job: any) => (
                        <View key={job._id} style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{job.jobTitle} at {job.name}</Text>
                            <Text style={styles.date}>
                                {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                            </Text>
                            <Text style={styles.text}>{job.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {data.projects && data.projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Projects</Text>
                    {data.projects.map((project: any) => (
                        <View key={project._id} style={{ marginBottom: 15 }} wrap={false}>
                            <Text style={styles.projectTitle}>{project.title}</Text>
                            <Text style={styles.text}>{project.shortDescription}</Text>
                            {project.link && <Text style={{ fontSize: 10, color: '#3b82f6' }}>Demo: {project.link}</Text>}
                            <View style={styles.tagContainer}>
                                {project.tags && project.tags.map((tag: string, i: number) => (
                                    <Text key={i} style={styles.tag}>{tag}</Text>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {data.education && data.education.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Education</Text>
                    {data.education.map((edu: any) => (
                        <View key={edu._id} style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{edu.schoolName}</Text>
                            <Text style={{ fontSize: 12 }}>{edu.degree} in {edu.fieldOfStudy}</Text>
                            <Text style={styles.date}>
                                {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {data.profile?.skills && (
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Skills</Text>
                    <View style={styles.tagContainer}>
                        {data.profile.skills.map((skill: string, i: number) => (
                            <Text key={i} style={styles.tag}>{skill}</Text>
                        ))}
                    </View>
                </View>
            )}

        </Page>
    </Document>
);
