import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingTools } from "@/types/domain-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Target, Users, TrendingUp } from "lucide-react";

interface MarketingToolsOverviewProps {
  marketingTools: MarketingTools;
}

export function MarketingToolsOverview({ marketingTools }: MarketingToolsOverviewProps) {
  const renderToolList = (items: string[], icon: React.ReactNode, title: string, description?: string) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Badge key={index} variant="outline" className="mr-2 mb-1">
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-xs">Not detected</span>
        )}
      </div>
    </div>
  );

  const getTotalTools = () => {
    return [
      ...marketingTools.googleAnalytics,
      ...marketingTools.facebookPixel,
      ...marketingTools.googleTagManager,
      ...marketingTools.googleAdSense,
      ...marketingTools.linkedinInsight,
      ...marketingTools.twitterAnalytics,
      ...marketingTools.hotjar
    ].length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Marketing & Analytics Tools
          <Badge variant="secondary" className="ml-auto">
            {getTotalTools()} tools detected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="advertising">Advertising</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            {renderToolList(
              marketingTools.googleAnalytics,
              <BarChart3 className="h-4 w-4 text-blue-500" />,
              "Google Analytics",
              "Website traffic and user behavior tracking"
            )}
            {renderToolList(
              marketingTools.googleTagManager,
              <Target className="h-4 w-4 text-green-500" />,
              "Google Tag Manager",
              "Tag and tracking code management"
            )}
            {renderToolList(
              marketingTools.hotjar,
              <Users className="h-4 w-4 text-orange-500" />,
              "Hotjar",
              "User behavior and heatmap analytics"
            )}
          </TabsContent>
          
          <TabsContent value="advertising" className="space-y-4">
            {renderToolList(
              marketingTools.googleAdSense,
              <Target className="h-4 w-4 text-green-600" />,
              "Google AdSense",
              "Display advertising monetization"
            )}
            {renderToolList(
              marketingTools.facebookPixel,
              <Target className="h-4 w-4 text-blue-600" />,
              "Facebook Pixel",
              "Facebook advertising and conversion tracking"
            )}
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            {renderToolList(
              marketingTools.linkedinInsight,
              <Users className="h-4 w-4 text-blue-700" />,
              "LinkedIn Insight",
              "LinkedIn advertising and analytics"
            )}
            {renderToolList(
              marketingTools.twitterAnalytics,
              <Users className="h-4 w-4 text-sky-500" />,
              "Twitter Analytics",
              "Twitter engagement and conversion tracking"
            )}
          </TabsContent>
        </Tabs>

        {getTotalTools() === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No marketing or analytics tools detected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}