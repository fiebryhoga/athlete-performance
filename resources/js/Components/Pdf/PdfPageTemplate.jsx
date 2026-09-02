import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 22,
        paddingBottom: 26,
        paddingHorizontal: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
        paddingBottom: 8,
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 13.5,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
        textTransform: 'uppercase',
        marginBottom: 2.5,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 8,
        fontFamily: 'Helvetica',
        color: '#64748b',
        lineHeight: 1.3,
    },
    headerRight: {
        marginLeft: 14,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    logo: {
        width: 125,
        height: 32,
        objectFit: 'contain',
    },
    content: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 12,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0.8,
        borderTopColor: '#cbd5e1',
        paddingTop: 5,
    },
    footerText: {
        fontSize: 6.5,
        fontFamily: 'Helvetica',
        color: '#94a3b8',
    },
    pageNumber: {
        fontSize: 6.5,
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
    headerFixed = false,
    children 
}) => {
    const resolvedLogoUrl = logoUrl || (typeof window !== 'undefined' ? `${window.location.origin}/assets/images/otslogo2.png` : '/assets/images/otslogo2.png');

    return (
        <Page size="A4" orientation={orientation} style={styles.page}>
            {/* ====== HEADER ====== */}
            <View style={styles.header} fixed={headerFixed}>
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
