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
    pdf.setFont("helvetica");
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Design System Colors - Fixed RGB values
    const colors = {
      primary: [34, 60, 29],
      primaryLight: [59, 130, 246],
      success: [34, 197, 94],
      warning: [251, 191, 36],
      destructive: [239, 68, 68],
      muted: [107, 114, 128],
      background: [248, 250, 252],
      text: [30, 41, 59]
    };

    // Professional Header with Branding
    yPosition = this.addProfessionalHeader(pdf, result, options, colors, yPosition);

    // Score Dashboard (simplified design)
    yPosition = this.addScoreDashboard(pdf, result, colors, yPosition);

    // Critical Issues Section
    if (result.criticalIssues > 0) {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 50);
      yPosition = this.addCriticalIssuesSection(pdf, result, colors, yPosition);
    }

    // Content based on report type
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 60);
    yPosition = this.addReportContent(pdf, result, options, colors, yPosition, pageHeight);

    // Enhanced Footer with contact
    this.addEnhancedFooter(pdf, pageWidth, pageHeight);

    // Save PDF
    const fileName = `${result.domain}-report-${options.type}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  private static checkPageBreak(pdf: jsPDF, yPosition: number, pageHeight: number, requiredSpace: number): number {
    if (yPosition + requiredSpace > pageHeight - 40) {
      pdf.addPage();
      return 30; // Reset to top margin
    }
    return yPosition;
  }

  private static addProfessionalHeader(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    options: ReportOptions, 
    colors: any, 
    yPosition: number
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Background header bar
    pdf.setFillColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Company branding
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Domain Analyzer Pro', 20, 25);
    
    // Report type badge
    const reportTypeText = {
      'executive': 'Executive Summary',
      'technical': 'Technical Deep-Dive',
      'action-plan': 'Action Plan',
      'competitor': 'Competitor Analysis'
    }[options.type];
    
    pdf.setFontSize(10);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth - 80, 15, 60, 15, 3, 3, 'F');
    pdf.setTextColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
    pdf.text(reportTypeText, pageWidth - 75, 25);
    
    // Domain and date
    pdf.setFontSize(20);
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.text(result.domain, 20, 65);
    
    pdf.setFontSize(12);
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.text(`Erstellt am: ${new Date(result.timestamp).toLocaleDateString('de-DE')}`, 20, 75);
    
    return 90;
  }

  private static addScoreDashboard(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    colors: any, 
    yPosition: number
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const overallScore = this.calculateOverallScore(result);
    const performanceScore = this.calculatePerformanceScore(result);
    const securityScore = result.securityAudit.score;
    const seoScore = this.calculateSEOScore(result);
    
    // Dashboard background
    pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
    pdf.roundedRect(15, yPosition, pageWidth - 30, 70, 5, 5, 'F');
    
    // Dashboard title
    pdf.setFontSize(16);
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.text('Score Dashboard', 25, yPosition + 15);
    
    // Score boxes (simplified design instead of circles)
    const scores = [
      { label: 'Overall', score: overallScore, x: 25 },
      { label: 'Performance', score: performanceScore, x: 70 },
      { label: 'Security', score: securityScore, x: 115 },
      { label: 'SEO', score: seoScore, x: 160 }
    ];
    
    scores.forEach(({ label, score, x }) => {
      this.drawScoreBox(pdf, x, yPosition + 25, score, colors);
      
      // Score text
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text(score.toString(), x + 15, yPosition + 42);
      
      // Label
      pdf.setFontSize(9);
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.text(label, x + 5, yPosition + 60);
    });
    
    return yPosition + 80;
  }

  private static drawScoreBox(pdf: jsPDF, x: number, y: number, score: number, colors: any): void {
    // Score color based on value
    let scoreColor = colors.success;
    if (score < 50) scoreColor = colors.destructive;
    else if (score < 70) scoreColor = colors.warning;
    else if (score < 90) scoreColor = [255, 165, 0]; // Orange
    
    // Score box background
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.roundedRect(x, y, 35, 25, 3, 3, 'F');
    
    // Progress bar
    const progressWidth = (score / 100) * 30;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(x + 2.5, y + 20, 30, 3, 'F');
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.rect(x + 2.5, y + 20, progressWidth, 3, 'F');
  }

  private static addCriticalIssuesSection(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    colors: any, 
    yPosition: number
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Critical issues header with red background
    pdf.setFillColor(colors.destructive[0], colors.destructive[1], colors.destructive[2]);
    pdf.roundedRect(15, yPosition, pageWidth - 30, 25, 5, 5, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text('! Kritische Probleme', 25, yPosition + 15);
    
    pdf.setFontSize(12);
    pdf.text(`${result.criticalIssues} Probleme gefunden`, pageWidth - 80, yPosition + 15);
    
    yPosition += 35;
    
    // List critical issues
    const criticalIssues = this.getCriticalIssuesList(result);
    
    criticalIssues.slice(0, 5).forEach((issue, index) => {
      pdf.setFontSize(10);
      pdf.setTextColor(colors.destructive[0], colors.destructive[1], colors.destructive[2]);
      pdf.text('-', 25, yPosition);
      
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const wrappedText = pdf.splitTextToSize(issue, pageWidth - 60);
      pdf.text(wrappedText, 30, yPosition);
      yPosition += wrappedText.length * 6;
    });
    
    return yPosition + 10;
  }

  private static addReportContent(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    options: ReportOptions, 
    colors: any, 
    yPosition: number,
    pageHeight: number
  ): number {
    
    if (options.type === 'executive') {
      yPosition = this.addExecutiveContent(pdf, result, colors, yPosition, pageHeight);
    } else if (options.type === 'technical') {
      yPosition = this.addTechnicalContent(pdf, result, colors, yPosition, pageHeight);
    } else if (options.type === 'action-plan') {
      yPosition = this.addActionPlanContent(pdf, result, colors, yPosition, pageHeight);
    }
    
    return yPosition;
  }

  private static addExecutiveContent(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    colors: any, 
    yPosition: number,
    pageHeight: number
  ): number {
    
    // Key Insights Section
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 40);
    yPosition = this.addSection(pdf, 'Executive Summary', colors, yPosition);
    
    const insights = [
      `Gesamtbewertung: ${this.calculateOverallScore(result)}/100`,
      `Sicherheitsstatus: ${result.httpsStatus.valid ? 'Sicher (HTTPS)' : 'Unsicher (HTTP)'}`,
      `Performance: ${this.calculatePerformanceScore(result)}/100`,
      `SEO-Optimierung: ${this.calculateSEOScore(result)}/100`
    ];
    
    insights.forEach(insight => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(11);
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.text(`- ${insight}`, 25, yPosition);
      yPosition += 8;
    });
    
    yPosition += 15;
    
    // Business Impact
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 40);
    yPosition = this.addSection(pdf, 'Business Impact', colors, yPosition);
    
    const businessImpacts = [
      'Verbesserung der Suchmaschinenrankings durch SEO-Optimierung',
      'Erhoehung der Conversion-Rate durch bessere Performance',
      'Schutz vor Sicherheitsbedrohungen und Datenlecks',
      'Staerkung des Vertrauens bei Kunden und Partnern'
    ];
    
    businessImpacts.forEach(impact => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(10);
      const impactText = pdf.splitTextToSize(`- ${impact}`, 160);
      pdf.text(impactText, 25, yPosition);
      yPosition += impactText.length * 6;
    });
    
    // Strategic Recommendations
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 40);
    yPosition = this.addSection(pdf, 'Strategische Empfehlungen', colors, yPosition + 15);
    
    const recommendations = [
      'Prioritaet 1: Sicherheit durch HTTPS und Updates staerken',
      'Prioritaet 2: Page Speed fuer bessere Nutzererfahrung optimieren',
      'Prioritaet 3: SEO-Grundlagen fuer hoehere Sichtbarkeit umsetzen',
      'Prioritaet 4: Monitoring-System fuer kontinuierliche Ueberwachung'
    ];
    
    recommendations.forEach(rec => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
      const recText = pdf.splitTextToSize(`- ${rec}`, 160);
      pdf.text(recText, 25, yPosition);
      yPosition += recText.length * 6;
    });
    
    return yPosition + 10;
  }

  private static addTechnicalContent(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    colors: any, 
    yPosition: number,
    pageHeight: number
  ): number {
    
    // Technology Stack
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 40);
    yPosition = this.addSection(pdf, 'Technology Stack', colors, yPosition);
    
    if (result.technologyAudit.cmsDetected) {
      pdf.setFontSize(11);
      const cmsText = pdf.splitTextToSize(`Content Management System: ${result.technologyAudit.cmsDetected}`, 160);
      pdf.text(cmsText, 25, yPosition);
      yPosition += cmsText.length * 6;
    }
    
    if (result.technologyDetails.jsLibraries.length > 0) {
      const jsText = pdf.splitTextToSize(`JavaScript Libraries: ${result.technologyDetails.jsLibraries.slice(0, 5).join(', ')}`, 160);
      pdf.text(jsText, 25, yPosition);
      yPosition += jsText.length * 6;
    }
    
    if (result.technologyDetails.cssFrameworks.length > 0) {
      const cssText = pdf.splitTextToSize(`CSS Frameworks: ${result.technologyDetails.cssFrameworks.slice(0, 3).join(', ')}`, 160);
      pdf.text(cssText, 25, yPosition);
      yPosition += cssText.length * 6;
    }
    
    yPosition += 10;
    
    // Performance Metrics
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 50);
    yPosition = this.addSection(pdf, 'Performance Metrics', colors, yPosition);
    
    const metrics = [
      `Mobile PageSpeed: ${result.pageSpeedScores.mobile || 'N/A'}/100`,
      `Desktop PageSpeed: ${result.pageSpeedScores.desktop || 'N/A'}/100`,
      `Largest Contentful Paint: ${result.coreWebVitals.lcp || 'N/A'}`,
      `Cumulative Layout Shift: ${result.coreWebVitals.cls || 'N/A'}`,
      `Interaction to Next Paint: ${result.coreWebVitals.inp || 'N/A'}`
    ];
    
    metrics.forEach(metric => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(10);
      pdf.text(`- ${metric}`, 25, yPosition);
      yPosition += 7;
    });
    
    // Security Analysis
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 50);
    yPosition = this.addSection(pdf, 'Security Analysis', colors, yPosition + 10);
    
    const securityItems = [
      `HTTPS Status: ${result.httpsStatus.valid ? 'Aktiv' : 'Nicht aktiv'}`,
      `SSL-Zertifikat: ${result.httpsStatus.sslValid ? 'Gueltig' : 'Ungueltig'}`,
      `Sicherheitsscore: ${result.securityAudit.score}/100`,
      `Vulnerable Libraries: ${result.securityAudit.vulnerableLibraries.length}`,
      `Veraltete Technologien: ${result.technologyAudit.outdatedTechnologies.length}`
    ];
    
    securityItems.forEach(item => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(10);
      pdf.text(`- ${item}`, 25, yPosition);
      yPosition += 7;
    });
    
    // SEO Analysis
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 50);
    yPosition = this.addSection(pdf, 'SEO Analysis', colors, yPosition + 10);
    
    const seoItems = [
      `Title Tag: ${result.seoAudit.hasTitle ? 'Vorhanden' : 'Fehlt'}`,
      `Meta Description: ${result.seoAudit.hasMetaDescription ? 'Vorhanden' : 'Fehlt'}`,
      `H1 Tag: ${result.seoAudit.hasH1 ? 'Vorhanden' : 'Fehlt'}`,
      `SEO Score: ${this.calculateSEOScore(result)}/100`
    ];
    
    seoItems.forEach(item => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(10);
      pdf.text(`- ${item}`, 25, yPosition);
      yPosition += 7;
    });
    
    if (result.seoAudit.issues.length > 0) {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 30);
      pdf.setFontSize(11);
      pdf.setTextColor(colors.warning[0], colors.warning[1], colors.warning[2]);
      pdf.text('SEO Probleme:', 25, yPosition);
      yPosition += 10;
      
      result.seoAudit.issues.slice(0, 8).forEach(issue => {
        yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
        pdf.setFontSize(9);
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const issueText = pdf.splitTextToSize(`- ${issue}`, 160);
        pdf.text(issueText, 30, yPosition);
        yPosition += issueText.length * 5;
      });
    }
    
    return yPosition + 10;
  }

  private static addActionPlanContent(
    pdf: jsPDF, 
    result: DomainAnalysisResult, 
    colors: any, 
    yPosition: number,
    pageHeight: number
  ): number {
    
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 40);
    yPosition = this.addSection(pdf, 'Priorisierte Handlungsempfehlungen', colors, yPosition);
    
    const actionItems = this.generateActionItems(result);
    
    actionItems.slice(0, 12).forEach((item, index) => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 30);
      
      // Priority badge
      const priorityColor = item.priority === 'Hoch' ? colors.destructive : 
                           item.priority === 'Mittel' ? colors.warning : colors.success;
      
      pdf.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      pdf.roundedRect(25, yPosition - 3, 20, 10, 2, 2, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text(item.priority, 28, yPosition + 3);
      
      // Action item
      pdf.setFontSize(11);
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const titleText = pdf.splitTextToSize(`${index + 1}. ${item.title}`, 140);
      pdf.text(titleText, 50, yPosition);
      
      pdf.setFontSize(9);
      pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
      pdf.text(`Aufwand: ${item.effort}`, 50, yPosition + (titleText.length * 6) + 5);
      
      yPosition += Math.max(20, titleText.length * 6 + 15);
    });
    
    // Add Implementation Timeline
    yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 50);
    yPosition = this.addSection(pdf, 'Umsetzungsplan', colors, yPosition + 15);
    
    const timeline = [
      'Woche 1-2: Kritische Sicherheitsprobleme beheben',
      'Woche 3-4: Performance-Optimierungen umsetzen',
      'Woche 5-6: SEO-Verbesserungen implementieren',
      'Woche 7-8: Monitoring und finale Tests'
    ];
    
    timeline.forEach(phase => {
      yPosition = this.checkPageBreak(pdf, yPosition, pageHeight, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.text(`- ${phase}`, 25, yPosition);
      yPosition += 8;
    });
    
    return yPosition;
  }

  private static addSection(pdf: jsPDF, title: string, colors: any, yPosition: number): number {
    pdf.setFontSize(14);
    pdf.setTextColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
    pdf.text(title, 20, yPosition);
    
    // Underline
    pdf.setDrawColor(colors.primaryLight[0], colors.primaryLight[1], colors.primaryLight[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition + 2, 20 + pdf.getTextWidth(title), yPosition + 2);
    
    return yPosition + 15;
  }

  private static addEnhancedFooter(pdf: jsPDF, pageWidth: number, pageHeight: number): void {
    const totalPages = pdf.internal.pages.length - 1;
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      
      // Contact email
      pdf.setFontSize(10);
      pdf.setTextColor(59, 130, 246);
      pdf.text('hi@inspiroware.com', 20, pageHeight - 10);
      
      // Page number
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Seite ${i} von ${totalPages}`, pageWidth - 40, pageHeight - 10);
      
      // Copyright
      pdf.setFontSize(8);
      pdf.text(`© ${new Date().getFullYear()} Domain Analyzer Pro - Powered by Inspiroware`, 20, pageHeight - 5);
    }
  }

  private static calculatePerformanceScore(result: DomainAnalysisResult): number {
    const mobile = result.pageSpeedScores.mobile || 0;
    const desktop = result.pageSpeedScores.desktop || 0;
    
    if (mobile === 0 && desktop === 0) return 0;
    if (mobile === 0) return desktop;
    if (desktop === 0) return mobile;
    
    return Math.round((mobile + desktop) / 2);
  }

  private static getCriticalIssuesList(result: DomainAnalysisResult): string[] {
    const issues = [];
    
    if (!result.httpsStatus.valid) {
      issues.push('Fehlende HTTPS-Verschlüsselung');
    }
    
    if (result.securityAudit.vulnerableLibraries.length > 0) {
      issues.push(`${result.securityAudit.vulnerableLibraries.length} vulnerable Bibliotheken`);
    }
    
    if (result.technologyAudit.outdatedTechnologies.length > 0) {
      issues.push(`${result.technologyAudit.outdatedTechnologies.length} veraltete Technologien`);
    }
    
    if (result.pageSpeedScores.mobile && result.pageSpeedScores.mobile < 50) {
      issues.push('Schlechte Mobile Performance');
    }
    
    if (!result.seoAudit.hasTitle) {
      issues.push('Fehlender Title Tag');
    }
    
    if (result.securityAudit.score < 50) {
      issues.push('Kritische Sicherheitslücken');
    }
    
    return issues;
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