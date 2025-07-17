import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SecurityAudit } from "@/types/domain-analysis";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SecurityInsightsProps {
  securityAudit: SecurityAudit;
}

export function SecurityInsights({ securityAudit }: SecurityInsightsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Security Score</span>
            <Badge variant={getScoreVariant(securityAudit.score)} className="px-3">
              {securityAudit.score}/100
            </Badge>
          </div>
          <Progress value={securityAudit.score} className="h-2" />
        </div>

        {/* Security Headers */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Headers
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              {securityAudit.securityHeaders.hsts ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">HSTS</span>
            </div>
            <div className="flex items-center gap-2">
              {securityAudit.securityHeaders.csp ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">CSP</span>
            </div>
            <div className="flex items-center gap-2">
              {securityAudit.securityHeaders.xFrameOptions ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">X-Frame-Options</span>
            </div>
            <div className="flex items-center gap-2">
              {securityAudit.securityHeaders.xContentTypeOptions ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">X-Content-Type</span>
            </div>
          </div>
        </div>

        {/* Vulnerable Libraries */}
        {securityAudit.vulnerableLibraries.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Vulnerable Libraries
            </h4>
            <div className="space-y-2">
              {securityAudit.vulnerableLibraries.map((library, index) => (
                <Badge key={index} variant="destructive" className="mr-2 mb-1">
                  {library}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Outdated Versions */}
        {securityAudit.outdatedVersions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Outdated Versions
            </h4>
            <div className="space-y-1">
              {securityAudit.outdatedVersions.map((version, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {version}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risky Scripts */}
        {securityAudit.riskyScripts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Risky Script Usage
            </h4>
            <div className="space-y-2">
              {securityAudit.riskyScripts.map((script, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-1">
                  {script}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* All Good Message */}
        {securityAudit.vulnerableLibraries.length === 0 && 
         securityAudit.riskyScripts.length === 0 && 
         securityAudit.score >= 80 && (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No major security issues detected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}