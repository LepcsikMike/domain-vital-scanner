import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DomainAnalysisResult } from '@/types/domain-analysis';

export interface ReportOptions {
  type: 'executive' | 'technical' | 'competitor' | 'action-plan';
  format: 'pdf' | 'csv';
  includeCharts: boolean;
  includeRecommendations: boolean;
}

export class ReportGenerator {
  
  static async generatePDFReport(
    result: DomainAnalysisResult, 
    options: ReportOptions = {
      type: 'executive',
      format: 'pdf',
      includeCharts: true,
      includeRecommendations: true
    }
  ): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // primary blue
    pdf.text('Domain Analyse Report', 20, yPosition);
    yPosition += 15;

    // Domain
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Domain: ${result.domain}`, 20, yPosition);
    yPosition += 10;

    // Timestamp
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray
    pdf.text(`Erstellt am: ${new Date(result.timestamp).toLocaleDateString('de-DE')}`, 20, yPosition);
    yPosition += 20;

    // Executive Summary
    if (options.type === 'executive' || options.type === 'action-plan') {
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Executive Summary', 20, yPosition);
      yPosition += 10;

      // Overall Score
      const overallScore = this.calculateOverallScore(result);
      pdf.setFontSize(12);
      pdf.text(`Gesamtbewertung: ${overallScore}/100`, 20, yPosition);
      yPosition += 8;

      // Critical Issues Count
      pdf.text(`Kritische Probleme: ${result.criticalIssues}`, 20, yPosition);
      yPosition += 8;

      // Status Summary
      const statusText = result.httpsStatus.valid ? 'Sicher (HTTPS)' : 'Unsicher (HTTP)';
      pdf.text(`Sicherheitsstatus: ${statusText}`, 20, yPosition);
      yPosition += 15;
    }

    // Technical Details
    if (options.type === 'technical' || options.type === 'action-plan') {
      pdf.setFontSize(16);
      pdf.text('Technische Details', 20, yPosition);
      yPosition += 10;

      // Technology Stack
      pdf.setFontSize(12);
      pdf.text('Erkannte Technologien:', 20, yPosition);
      yPosition += 8;

      if (result.technologyAudit.cmsDetected) {
        pdf.text(`• CMS: ${result.technologyAudit.cmsDetected}`, 25, yPosition);
        yPosition += 6;
      }

      if (result.technologyDetails.jsLibraries.length > 0) {
        pdf.text(`• JavaScript: ${result.technologyDetails.jsLibraries.slice(0, 3).join(', ')}`, 25, yPosition);
        yPosition += 6;
      }

      if (result.technologyDetails.cssFrameworks.length > 0) {
        pdf.text(`• CSS Frameworks: ${result.technologyDetails.cssFrameworks.slice(0, 3).join(', ')}`, 25, yPosition);
        yPosition += 6;
      }

      yPosition += 10;

      // Performance Scores
      pdf.text('Performance Scores:', 20, yPosition);
      yPosition += 8;

      if (result.pageSpeedScores.mobile) {
        pdf.text(`• Mobile: ${result.pageSpeedScores.mobile}/100`, 25, yPosition);
        yPosition += 6;
      }

      if (result.pageSpeedScores.desktop) {
        pdf.text(`• Desktop: ${result.pageSpeedScores.desktop}/100`, 25, yPosition);
        yPosition += 6;
      }

      yPosition += 10;
    }

    // Security Audit
    pdf.setFontSize(16);
    pdf.text('Sicherheitsaudit', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Sicherheitsscore: ${result.securityAudit.score}/100`, 20, yPosition);
    yPosition += 8;

    if (result.securityAudit.vulnerableLibraries.length > 0) {
      pdf.text('Vulnerable Bibliotheken:', 20, yPosition);
      yPosition += 6;
      result.securityAudit.vulnerableLibraries.slice(0, 5).forEach(lib => {
        pdf.text(`• ${lib}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    if (result.securityAudit.outdatedVersions.length > 0) {
      pdf.text('Veraltete Versionen:', 20, yPosition);
      yPosition += 6;
      result.securityAudit.outdatedVersions.slice(0, 5).forEach(version => {
        pdf.text(`• ${version}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // SEO Audit
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.text('SEO Audit', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    const seoStatus = [
      `Title Tag: ${result.seoAudit.hasTitle ? '✓' : '✗'}`,
      `Meta Description: ${result.seoAudit.hasMetaDescription ? '✓' : '✗'}`,
      `H1 Tag: ${result.seoAudit.hasH1 ? '✓' : '✗'}`
    ];

    seoStatus.forEach(status => {
      pdf.text(status, 20, yPosition);
      yPosition += 6;
    });

    if (result.seoAudit.issues.length > 0) {
      yPosition += 5;
      pdf.text('SEO Probleme:', 20, yPosition);
      yPosition += 6;
      result.seoAudit.issues.slice(0, 5).forEach(issue => {
        pdf.text(`• ${issue}`, 25, yPosition);
        yPosition += 6;
      });
    }

    // Action Items (for action-plan type)
    if (options.type === 'action-plan' || options.includeRecommendations) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.text('Empfohlene Maßnahmen', 20, yPosition);
      yPosition += 10;

      const actionItems = this.generateActionItems(result);
      pdf.setFontSize(12);

      actionItems.forEach((item, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(`${index + 1}. ${item.title}`, 20, yPosition);
        yPosition += 6;
        pdf.setFontSize(10);
        pdf.text(`   Priorität: ${item.priority} | Aufwand: ${item.effort}`, 20, yPosition);
        yPosition += 6;
        pdf.setFontSize(12);
        yPosition += 3;
      });
    }

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Seite ${i} von ${totalPages}`, pageWidth - 30, pageHeight - 10);
      pdf.text(`© ${new Date().getFullYear()} Domain Analyzer`, 20, pageHeight - 10);
    }

    // Save PDF
    const fileName = `${result.domain}-report-${options.type}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  static generateEnhancedCSV(results: DomainAnalysisResult[]): void {
    const headers = [
      'Domain',
      'Analyse_Datum',
      'HTTPS_Status',
      'SSL_Gültig',
      'CMS_Erkannt',
      'Veraltete_Technologien',
      'JavaScript_Bibliotheken',
      'CSS_Frameworks',
      'Marketing_Tools',
      'PageSpeed_Mobile',
      'PageSpeed_Desktop',
      'LCP',
      'CLS',
      'INP',
      'SEO_Score',
      'SEO_Probleme',
      'Sicherheitsscore',
      'Vulnerable_Bibliotheken',
      'Veraltete_Versionen',
      'Sicherheitsheader',
      'Kritische_Probleme',
      'Branche',
      'Marktposition',
      'Empfehlungen'
    ];

    const csvData = results.map(result => [
      result.domain,
      new Date(result.timestamp).toLocaleDateString('de-DE'),
      result.httpsStatus.valid ? 'Ja' : 'Nein',
      result.httpsStatus.sslValid ? 'Ja' : 'Nein',
      result.technologyAudit.cmsDetected || 'Nicht erkannt',
      result.technologyAudit.outdatedTechnologies.join('; ') || 'Keine',
      result.technologyDetails.jsLibraries.join('; ') || 'Keine',
      result.technologyDetails.cssFrameworks.join('; ') || 'Keine',
      [
        ...result.marketingTools.googleAnalytics,
        ...result.marketingTools.facebookPixel,
        ...result.marketingTools.googleTagManager
      ].join('; ') || 'Keine',
      result.pageSpeedScores.mobile || 'N/A',
      result.pageSpeedScores.desktop || 'N/A',
      result.coreWebVitals.lcp || 'N/A',
      result.coreWebVitals.cls || 'N/A',
      result.coreWebVitals.inp || 'N/A',
      this.calculateSEOScore(result),
      result.seoAudit.issues.join('; ') || 'Keine',
      result.securityAudit.score,
      result.securityAudit.vulnerableLibraries.join('; ') || 'Keine',
      result.securityAudit.outdatedVersions.join('; ') || 'Keine',
      this.getSecurityHeadersStatus(result.securityAudit.securityHeaders),
      result.criticalIssues,
      result.competitorInsights.industryCategory || 'Unbekannt',
      result.competitorInsights.marketPosition || 'Unbekannt',
      this.generateActionItems(result).slice(0, 3).map(item => item.title).join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `erweiterte-domain-analyse-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static calculateOverallScore(result: DomainAnalysisResult): number {
    let score = 0;
    let factors = 0;

    // HTTPS (20 points)
    if (result.httpsStatus.valid && result.httpsStatus.sslValid) {
      score += 20;
    } else if (result.httpsStatus.valid) {
      score += 10;
    }
    factors += 20;

    // Page Speed (30 points)
    if (result.pageSpeedScores.mobile || result.pageSpeedScores.desktop) {
      const mobile = result.pageSpeedScores.mobile || 0;
      const desktop = result.pageSpeedScores.desktop || 0;
      const avgSpeed = (mobile + desktop) / 2;
      score += (avgSpeed / 100) * 30;
    }
    factors += 30;

    // Security (25 points)
    score += (result.securityAudit.score / 100) * 25;
    factors += 25;

    // SEO (25 points)
    const seoScore = this.calculateSEOScore(result);
    score += (seoScore / 100) * 25;
    factors += 25;

    return Math.round((score / factors) * 100);
  }

  private static calculateSEOScore(result: DomainAnalysisResult): number {
    let score = 0;
    if (result.seoAudit.hasTitle) score += 25;
    if (result.seoAudit.hasMetaDescription) score += 25;
    if (result.seoAudit.hasH1) score += 25;
    
    // Deduct points for issues
    const issueDeduction = Math.min(result.seoAudit.issues.length * 5, 25);
    score += Math.max(25 - issueDeduction, 0);

    return score;
  }

  private static getSecurityHeadersStatus(headers: any): string {
    const active = [];
    if (headers.hsts) active.push('HSTS');
    if (headers.csp) active.push('CSP');
    if (headers.xFrameOptions) active.push('X-Frame-Options');
    if (headers.xContentTypeOptions) active.push('X-Content-Type-Options');
    return active.join('; ') || 'Keine';
  }

  private static generateActionItems(result: DomainAnalysisResult) {
    const items = [];

    // HTTPS Issues
    if (!result.httpsStatus.valid) {
      items.push({
        title: 'HTTPS-Verschlüsselung implementieren',
        priority: 'Hoch',
        effort: 'Mittel'
      });
    }

    // Outdated Technologies
    if (result.technologyAudit.outdatedTechnologies.length > 0) {
      items.push({
        title: 'Veraltete Technologien aktualisieren',
        priority: 'Hoch',
        effort: 'Hoch'
      });
    }

    // Page Speed
    if (result.pageSpeedScores.mobile && result.pageSpeedScores.mobile < 50) {
      items.push({
        title: 'Mobile Performance optimieren',
        priority: 'Hoch',
        effort: 'Mittel'
      });
    }

    // SEO Issues
    if (!result.seoAudit.hasTitle) {
      items.push({
        title: 'Title Tag hinzufügen',
        priority: 'Mittel',
        effort: 'Niedrig'
      });
    }

    if (!result.seoAudit.hasMetaDescription) {
      items.push({
        title: 'Meta Description hinzufügen',
        priority: 'Mittel',
        effort: 'Niedrig'
      });
    }

    // Security Issues
    if (result.securityAudit.vulnerableLibraries.length > 0) {
      items.push({
        title: 'Sicherheitslücken in Bibliotheken schließen',
        priority: 'Hoch',
        effort: 'Mittel'
      });
    }

    if (result.securityAudit.score < 70) {
      items.push({
        title: 'Sicherheitsheader konfigurieren',
        priority: 'Mittel',
        effort: 'Niedrig'
      });
    }

    return items.slice(0, 10); // Top 10 action items
  }
}