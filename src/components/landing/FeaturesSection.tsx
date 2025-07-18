
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, FileText, Search, Download, Globe, Lock, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-purple-400" />,
      title: "Professional PDF Reports",
      description: "Erstellen Sie hochwertige PDF-Reports wie SEOptimer: Executive Summary, Technical Deep-Dive und Action Plans",
      highlights: ["Executive Summary PDF", "Technical Deep-Dive Report", "Action Plan mit Prioritäten"]
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: "Sicherheits-Audit",
      description: "Automatische Erkennung von HTTP-Websites, SSL-Problemen und Sicherheitslücken",
      highlights: ["HTTPS-Status", "SSL-Zertifikat Prüfung", "Security Headers"]
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Performance-Analyse",
      description: "Google PageSpeed Insights Integration mit echten Core Web Vitals Daten",
      highlights: ["LCP, CLS, INP", "Mobile & Desktop", "Performance Score"]
    },
    {
      icon: <Search className="h-8 w-8 text-blue-400" />,
      title: "SEO-Checks",
      description: "Umfassende SEO-Analyse mit Meta-Tags, Sitemap und Crawlbarkeit",
      highlights: ["Meta-Tags", "Robots.txt", "Schema Markup"]
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-400" />,
      title: "Domain Discovery",
      description: "Intelligente Suche nach Domains mit Google Custom Search API",
      highlights: ["Branchen-Filter", "Multi-TLD", "Common Crawl"]
    },
    {
      icon: <Download className="h-8 w-8 text-orange-400" />,
      title: "Enhanced Export & Integration",
      description: "PDF-Reports, Enhanced CSV-Export (20+ Felder) und API-Zugriff für CRM-Integration",
      highlights: ["PDF Report Export", "Enhanced CSV (20+ Felder)", "JSON API & CRM Integration"]
    }
  ];

  return (
    <div className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Alles was Sie für{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Website-Audits
            </span>{' '}
            brauchen
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Von der automatischen Domain-Erkennung bis zum detaillierten Audit-Report – 
            alle Tools in einer Plattform vereint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3" />
                      <span className="text-slate-400">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Credibility */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-slate-900/30 border border-slate-700 rounded-full px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-300 text-sm">Google APIs</span>
            </div>
            <div className="w-px h-4 bg-slate-600" />
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Sichere Analyse</span>
            </div>
            <div className="w-px h-4 bg-slate-600" />
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="text-slate-300 text-sm">Echte Daten</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
