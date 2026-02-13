"use client";
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PortfolioPDFDocument } from './PortfolioPDFDocument';

interface Props {
    data: {
        profile: any;
        education: any[];
        jobs: any[];
        projects: any[];
    }
}

export default function DownloadPDFButton({ data }: Props) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <PDFDownloadLink
            document={<PortfolioPDFDocument data={data} />}
            fileName="portfolio.pdf"
            className="px-8 py-3 border border-primary text-primary font-bold rounded hover:bg-primary/10 transition-all text-center inline-block"
        >
            {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : 'Download Portfolio PDF'
            }
        </PDFDownloadLink>
    );
}
