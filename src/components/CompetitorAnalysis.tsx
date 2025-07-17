import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CompetitorInsights } from "@/types/domain-analysis";
import { Users, TrendingUp, Building, Target } from "lucide-react";

interface CompetitorAnalysisProps {
  competitorInsights: CompetitorInsights;
}

export function CompetitorAnalysis({ competitorInsights }: CompetitorAnalysisProps) {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'leading':
        return 'bg-green-500';
      case 'following':
        return 'bg-yellow-500';
      case 'emerging':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPositionText = (position: string) => {
    switch (position) {
      case 'leading':
        return 'Technology Leader';
      case 'following':
        return 'Market Follower';
      case 'emerging':
        return 'Emerging Player';
      default:
        return 'Unknown Position';
    }
  };

  const getSimilarityLevel = (similarity: number) => {
    if (similarity >= 80) return 'Very High';
    if (similarity >= 60) return 'High';
    if (similarity >= 40) return 'Medium';
    if (similarity >= 20) return 'Low';
    return 'Very Low';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Competitive Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Industry Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Industry Category</span>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {competitorInsights.industryCategory}
          </Badge>
        </div>

        {/* Market Position */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Market Position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPositionColor(competitorInsights.marketPosition)}`} />
            <span className="text-sm">{getPositionText(competitorInsights.marketPosition)}</span>
          </div>
        </div>

        {/* Technical Similarity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Technical Modernity</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {getSimilarityLevel(competitorInsights.technicalSimilarity)}
              </span>
              <span className="text-xs font-medium">
                {competitorInsights.technicalSimilarity}%
              </span>
            </div>
            <Progress value={competitorInsights.technicalSimilarity} className="h-2" />
          </div>
        </div>

        {/* Shared Technologies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Key Technologies</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {competitorInsights.sharedTechnologies.length > 0 ? (
              competitorInsights.sharedTechnologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">No shared technologies identified</span>
            )}
          </div>
        </div>

        {/* Similar Domains (placeholder - would be populated with real data) */}
        {competitorInsights.similarDomains.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium">Similar Websites</span>
            </div>
            <div className="space-y-1">
              {competitorInsights.similarDomains.map((domain, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {domain}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Recommendations</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {competitorInsights.marketPosition === 'emerging' && (
              <p>• Consider adopting more modern technologies to improve market position</p>
            )}
            {competitorInsights.technicalSimilarity < 50 && (
              <p>• Technology stack could benefit from modernization</p>
            )}
            {competitorInsights.sharedTechnologies.length < 3 && (
              <p>• Limited technology overlap suggests unique approach or outdated stack</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}