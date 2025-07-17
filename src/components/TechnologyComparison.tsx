import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechnologyDetails } from "@/types/domain-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Layers, Shield, Globe, Smartphone } from "lucide-react";

interface TechnologyComparisonProps {
  technologyDetails: TechnologyDetails;
}

export function TechnologyComparison({ technologyDetails }: TechnologyComparisonProps) {
  const renderTechList = (items: string[], icon: React.ReactNode, title: string) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-xs">None detected</span>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Technology Stack Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frontend" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frontend" className="space-y-4">
            {renderTechList(
              technologyDetails.jsLibraries,
              <Code className="h-4 w-4 text-blue-500" />,
              "JavaScript Libraries"
            )}
            {renderTechList(
              technologyDetails.cssFrameworks,
              <Layers className="h-4 w-4 text-purple-500" />,
              "CSS Frameworks"
            )}
          </TabsContent>
          
          <TabsContent value="backend" className="space-y-4">
            {renderTechList(
              technologyDetails.serverTech,
              <Globe className="h-4 w-4 text-green-500" />,
              "Server Technology"
            )}
            {renderTechList(
              technologyDetails.cdnProviders,
              <Globe className="h-4 w-4 text-orange-500" />,
              "CDN Providers"
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            {renderTechList(
              technologyDetails.ecommercePlatforms,
              <Smartphone className="h-4 w-4 text-emerald-500" />,
              "E-commerce Platforms"
            )}
            {renderTechList(
              technologyDetails.securityTools,
              <Shield className="h-4 w-4 text-red-500" />,
              "Security Tools"
            )}
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            {renderTechList(
              technologyDetails.socialWidgets,
              <Smartphone className="h-4 w-4 text-blue-400" />,
              "Social Media Widgets"
            )}
            {renderTechList(
              technologyDetails.analyticsTools,
              <Code className="h-4 w-4 text-indigo-500" />,
              "Analytics Tools"
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}