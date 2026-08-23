import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 14,
        paddingBottom: 22,
        paddingHorizontal: 14,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.8,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 6,
        marginBottom: 8,
    },
    headerLeft: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 13,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
        textTransform: 'uppercase',
        marginBottom: 2,
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 7.5,
        fontFamily: 'Helvetica',
        color: '#64748b',
    },
    headerRight: {
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    logo: {
        width: 130,
        height: 32,
        objectFit: 'contain',
    },
    content: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        left: 14,
        right: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0.8,
        borderTopColor: '#e2e8f0',
        paddingTop: 3.5,
    },
    footerText: {
        fontSize: 6,
        fontFamily: 'Helvetica',
        color: '#94a3b8',
    },
    pageNumber: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: '#94a3b8',
    }
});

export const PdfPageTemplate = ({ 
    title = "LAPORAN PROFILING & ANALISIS PERFORMA", 
    subtitle = "Olympus Athlete Performance & Development System",
    logoUrl, 
    orientation = "portrait",
    footerLeftText = "Olympus Training Surabaya • Profiling & Integrated Performance Report",
    children 
}) => {
    const resolvedLogoUrl = logoUrl || (typeof window !== 'undefined' ? `${window.location.origin}/assets/images/otslogo2.png` : '/assets/images/otslogo2.png');

    return (
        <Page size="A4" orientation={orientation} style={styles.page}>
            {/* ====== HEADER ====== */}
            <View style={styles.header} fixed>
                <View style={styles.headerLeft}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <View style={styles.headerRight}>
                    <Image src={resolvedLogoUrl} style={styles.logo} />
                </View>
            </View>

            {/* ====== KONTEN UTAMA ====== */}
            <View style={styles.content}>
                {children}
            </View>

            {/* ====== FOOTER ====== */}
            <View style={styles.footer} fixed>
                <Text style={styles.footerText}>{footerLeftText}</Text>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `Hal ${pageNumber} dari ${totalPages}`
                )} fixed />
            </View>
        </Page>
    );
};

export default PdfPageTemplate;
