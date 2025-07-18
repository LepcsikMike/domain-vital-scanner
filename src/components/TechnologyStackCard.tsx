import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnologyDetails, MarketingTools, SecurityAudit, CompetitorInsights } from '@/types/domain-analysis';
import { 
  Cpu, 
  Code2, 
  BarChart3, 
  Shield, 
  Globe, 
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';

interface TechnologyStackCardProps {
  technologyDetails: TechnologyDetails;
  marketingTools: MarketingTools;
  securityAudit: SecurityAudit;
  competitorInsights: CompetitorInsights;
}

export const TechnologyStackCard: React.FC<TechnologyStackCardProps> = ({
  technologyDetails,
  marketingTools,
  securityAudit,
  competitorInsights
}) => {
  const renderTechList = (items: string[], icon: React.ReactNode, title: string, emptyText: string = "Keine erkannt") => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {icon}
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );

  const getSecurityColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case 'leading': return "text-green-400";
      case 'following': return "text-blue-400";
      default: return "text-orange-400";
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Cpu className="h-5 w-5" />
          <span>Technology Stack Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="technologies" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="technologies" className="text-xs">Tech Stack</TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs">Marketing</TabsTrigger>
            <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
            <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="technologies" className="space-y-4">
            <div className="grid gap-4">
              {renderTechList(
                technologyDetails.jsLibraries,
                <Code2 className="h-4 w-4 text-blue-400" />,
                "JavaScript Libraries"
              )}
              
              {renderTechList(
                technologyDetails.cssFrameworks,
                <Zap className="h-4 w-4 text-purple-400" />,
                "CSS Frameworks"
              )}
              
              {renderTechList(
                technologyDetails.serverTech,
                <Globe className="h-4 w-4 text-green-400" />,
                "Server Technologies"
              )}
              
              {renderTechList(
                technologyDetails.ecommercePlatforms,
                <BarChart3 className="h-4 w-4 text-yellow-400" />,
                "E-Commerce Platforms"
              )}
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <div className="grid gap-4">
              {renderTechList(
                marketingTools.googleAnalytics,
                <BarChart3 className="h-4 w-4 text-orange-400" />,
                "Google Analytics"
              )}
              
              {renderTechList(
                marketingTools.facebookPixel,
                <Users className="h-4 w-4 text-blue-400" />,
                "Facebook Pixel"
              )}
              
              {renderTechList(
                marketingTools.googleTagManager,
                <Code2 className="h-4 w-4 text-green-400" />,
                "Google Tag Manager"
              )}
              
              {renderTechList(
                [...marketingTools.hotjar, ...marketingTools.mixpanel],
                <TrendingUp className="h-4 w-4 text-purple-400" />,
                "User Analytics"
              )}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className={`h-4 w-4 ${getSecurityColor(securityAudit.score)}`} />
                  <span className="text-sm font-medium">Security Score</span>
                </div>
                <Badge className={getSecurityColor(securityAudit.score)}>
                  {securityAudit.score}/100
                </Badge>
              </div>
              
              <Progress value={securityAudit.score} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>HSTS</span>
                    <Badge variant={securityAudit.securityHeaders.hsts ? "default" : "destructive"} className="text-xs">
                      {securityAudit.securityHeaders.hsts ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>CSP</span>
                    <Badge variant={securityAudit.securityHeaders.csp ? "default" : "destructive"} className="text-xs">
                      {securityAudit.securityHeaders.csp ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>X-Frame</span>
                    <Badge variant={securityAudit.securityHeaders.xFrameOptions ? "default" : "destructive"} className="text-xs">
                      {securityAudit.securityHeaders.xFrameOptions ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>X-Content</span>
                    <Badge variant={securityAudit.securityHeaders.xContentTypeOptions ? "default" : "destructive"} className="text-xs">
                      {securityAudit.securityHeaders.xContentTypeOptions ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
              </div>

              {securityAudit.vulnerableLibraries.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-400">Vulnerable Libraries</h4>
                  <div className="space-y-1">
                    {securityAudit.vulnerableLibraries.map((lib, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {lib}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">Market Position</span>
                </div>
                <Badge className={getMarketPositionColor(competitorInsights.marketPosition)}>
                  {competitorInsights.marketPosition.charAt(0).toUpperCase() + competitorInsights.marketPosition.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Industry Category</span>
                  <Badge variant="outline">{competitorInsights.industryCategory}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Technical Similarity</span>
                  <Badge variant="secondary">{competitorInsights.technicalSimilarity}%</Badge>
                </div>
              </div>

              <Progress value={competitorInsights.technicalSimilarity} className="h-2" />

              {competitorInsights.sharedTechnologies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Shared Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {competitorInsights.sharedTechnologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {competitorInsights.similarDomains.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Similar Domains</h4>
                  <div className="space-y-1">
                    {competitorInsights.similarDomains.slice(0, 3).map((domain, index) => (
                      <div key={index} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};