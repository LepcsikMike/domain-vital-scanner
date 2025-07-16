
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface FeatureGateProps {
  children: ReactNode;
  feature: 'export' | 'api' | 'batch' | 'unlimited';
  fallback?: ReactNode;
}

export const FeatureGate = ({ children, feature, fallback }: FeatureGateProps) => {
  const { isEnterprise, upgradeToPro } = usePlan();

  if (isEnterprise) {
    return <>{children}</>;
  }

  const featureNames = {
    export: 'CSV/JSON Export',
    api: 'API-Integration',
    batch: 'Batch-Analyse',
    unlimited: 'Unbegrenzte Scans'
  };

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="bg-slate-900/30 border-slate-700 border-dashed">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full">
            <Lock className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {featureNames[feature]} - Enterprise Feature
        </h3>
        <p className="text-slate-400 mb-4">
          Schalten Sie diese Funktion mit dem Enterprise Plan frei
        </p>
        <Button 
          onClick={upgradeToPro}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <Crown className="h-4 w-4 mr-2" />
          Jetzt upgraden
        </Button>
      </CardContent>
    </Card>
  );
};
