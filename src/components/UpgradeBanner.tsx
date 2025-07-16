
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

export const UpgradeBanner = () => {
  const { isEnterprise, upgradeToPro, dailyScansUsed, dailyScansLimit } = usePlan();

  if (isEnterprise) {
    return null;
  }

  const handleEnterpriseAccess = () => {
    window.open('/enterprise', '_blank');
  };

  return (
    <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Enterprise Plan</h3>
              <p className="text-slate-300 text-sm">
                Unbegrenzte Scans • CSV Export • API-Integration • Erweiterte Analyse
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-slate-400 text-xs">Heute verwendet</div>
              <div className="text-white font-bold">{dailyScansUsed}/{dailyScansLimit}</div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleEnterpriseAccess}
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Enterprise Testen
              </Button>
              <Button 
                onClick={upgradeToPro}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Kaufen
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
