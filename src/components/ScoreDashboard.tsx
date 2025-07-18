import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Search, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ScoreCircleProps {
  score: number | null;
  label: string;
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, label, icon, size = 'md' }) => {
  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    if (score >= 50) return 'text-orange-500';
    return 'text-destructive';
  };

  const getProgressColor = (score: number | null) => {
    if (!score) return 'bg-muted';
    if (score >= 90) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-destructive';
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full bg-muted/20"></div>
        
        {/* Progress Ring */}
        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/30"
          />
          {score && (
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${score * 2.83} 283`}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          )}
        </svg>
        
        {/* Score Text */}
        <div className="flex flex-col items-center z-10">
          <span className={`font-bold ${textSizeClasses[size]} ${getScoreColor(score)}`}>
            {score || '—'}
          </span>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center">
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          {icon}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

interface CriticalIssueAlertProps {
  issues: string[];
  type: 'security' | 'seo' | 'technology' | 'performance';
}

const CriticalIssueAlert: React.FC<CriticalIssueAlertProps> = ({ issues, type }) => {
  if (issues.length === 0) return null;

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'security':
        return { 
          color: 'destructive', 
          icon: <Shield className="h-4 w-4" />, 
          label: 'Sicherheit' 
        };
      case 'seo':
        return { 
          color: 'destructive', 
          icon: <Search className="h-4 w-4" />, 
          label: 'SEO' 
        };
      case 'technology':
        return { 
          color: 'destructive', 
          icon: <AlertTriangle className="h-4 w-4" />, 
          label: 'Veraltete Technologien' 
        };
      case 'performance':
        return { 
          color: 'destructive', 
          icon: <Zap className="h-4 w-4" />, 
          label: 'Performance' 
        };
      default:
        return { 
          color: 'destructive', 
          icon: <XCircle className="h-4 w-4" />, 
          label: 'Probleme' 
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        {config.icon}
        <span className="font-medium text-destructive">{config.label}</span>
        <Badge variant="destructive" className="text-xs">
          {issues.length} {issues.length === 1 ? 'Problem' : 'Probleme'}
        </Badge>
      </div>
      <ul className="text-sm text-muted-foreground space-y-1">
        {issues.slice(0, 3).map((issue, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-destructive mt-0.5">•</span>
            <span>{issue}</span>
          </li>
        ))}
        {issues.length > 3 && (
          <li className="text-xs text-muted-foreground italic">
            ... und {issues.length - 3} weitere
          </li>
        )}
      </ul>
    </div>
  );
};

interface ScoreDashboardProps {
  pageSpeedMobile: number | null;
  pageSpeedDesktop: number | null;
  securityScore: number;
  seoIssues: string[];
  securityIssues: string[];
  technologyIssues: string[];
  performanceIssues: string[];
  overallScore?: number;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({
  pageSpeedMobile,
  pageSpeedDesktop,
  securityScore,
  seoIssues,
  securityIssues,
  technologyIssues,
  performanceIssues,
  overallScore
}) => {
  const calculateOverallScore = () => {
    if (overallScore) return overallScore;
    
    const scores = [
      pageSpeedMobile || 0,
      pageSpeedDesktop || 0,
      securityScore || 0,
      Math.max(0, 100 - seoIssues.length * 10) // SEO score based on issues
    ].filter(s => s > 0);
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  const overallScoreValue = calculateOverallScore();
  const criticalIssues = [...securityIssues, ...technologyIssues, ...performanceIssues];

  return (
    <div className="space-y-6">
      {/* Main Score Circles */}
      <div className="flex justify-center gap-8 md:gap-12">
        <ScoreCircle
          score={overallScoreValue}
          label="Gesamt"
          icon={<CheckCircle className="h-4 w-4" />}
          size="lg"
        />
        <ScoreCircle
          score={pageSpeedMobile}
          label="Mobile Speed"
          icon={<Zap className="h-4 w-4" />}
          size="md"
        />
        <ScoreCircle
          score={securityScore}
          label="Sicherheit"
          icon={<Shield className="h-4 w-4" />}
          size="md"
        />
        <ScoreCircle
          score={Math.max(0, 100 - seoIssues.length * 10)}
          label="SEO"
          icon={<Search className="h-4 w-4" />}
          size="md"
        />
      </div>

      {/* Critical Issues Alerts */}
      {criticalIssues.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <CriticalIssueAlert issues={securityIssues} type="security" />
          <CriticalIssueAlert issues={seoIssues} type="seo" />
          <CriticalIssueAlert issues={technologyIssues} type="technology" />
          <CriticalIssueAlert issues={performanceIssues} type="performance" />
        </div>
      )}
    </div>
  );
};