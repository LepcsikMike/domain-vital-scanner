
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Crown, Zap } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

export const PlanBadge = () => {
  const { isEnterprise } = usePlan();

  if (isEnterprise) {
    return (
      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
        <Crown className="h-3 w-3 mr-1" />
        Enterprise
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-slate-600 text-slate-400">
      <Zap className="h-3 w-3 mr-1" />
      Kostenlos
    </Badge>
  );
};
