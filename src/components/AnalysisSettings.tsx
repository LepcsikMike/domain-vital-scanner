
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';

interface AnalysisSettings {
  checkHTTPS: boolean;
  checkTechnology: boolean;
  checkPageSpeed: boolean;
  checkSEO: boolean;
  checkCrawling: boolean;
  batchSize: number;
  timeout: number;
  includeSubdomains: boolean;
}

interface AnalysisSettingsProps {
  settings: AnalysisSettings;
  onSettingsChange: (settings: AnalysisSettings) => void;
}

export const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const { t } = useTranslation('app');
  const updateSetting = (key: keyof AnalysisSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Analysis Modules */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">{t('analysisSettings.title')}</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="https-check" className="text-slate-400 cursor-pointer">
              {t('analysisSettings.modules.httpsCheck')}
            </Label>
            <Switch
              id="https-check"
              checked={settings.checkHTTPS}
              onCheckedChange={(checked) => updateSetting('checkHTTPS', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="tech-check" className="text-slate-400 cursor-pointer">
              {t('analysisSettings.modules.technologyAudit')}
            </Label>
            <Switch
              id="tech-check"
              checked={settings.checkTechnology}
              onCheckedChange={(checked) => updateSetting('checkTechnology', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="speed-check" className="text-slate-400 cursor-pointer">
              {t('analysisSettings.modules.pageSpeedInsights')}
            </Label>
            <Switch
              id="speed-check"
              checked={settings.checkPageSpeed}
              onCheckedChange={(checked) => updateSetting('checkPageSpeed', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-check" className="text-slate-400 cursor-pointer">
              {t('analysisSettings.modules.seoAudit')}
            </Label>
            <Switch
              id="seo-check"
              checked={settings.checkSEO}
              onCheckedChange={(checked) => updateSetting('checkSEO', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="crawl-check" className="text-slate-400 cursor-pointer">
              {t('analysisSettings.modules.crawlingStatus')}
            </Label>
            <Switch
              id="crawl-check"
              checked={settings.checkCrawling}
              onCheckedChange={(checked) => updateSetting('checkCrawling', checked)}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Performance Settings */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">{t('analysisSettings.performance.title')}</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="batch-size" className="text-slate-400">
              {t('analysisSettings.performance.batchSize')}
            </Label>
            <Select 
              value={settings.batchSize.toString()} 
              onValueChange={(value) => updateSetting('batchSize', parseInt(value))}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">{t('analysisSettings.performance.batchSizes.5')}</SelectItem>
                <SelectItem value="10">{t('analysisSettings.performance.batchSizes.10')}</SelectItem>
                <SelectItem value="20">{t('analysisSettings.performance.batchSizes.20')}</SelectItem>
                <SelectItem value="50">{t('analysisSettings.performance.batchSizes.50')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeout" className="text-slate-400">
              {t('analysisSettings.performance.timeout')}
            </Label>
            <Input
              id="timeout"
              type="number"
              value={settings.timeout}
              onChange={(e) => updateSetting('timeout', parseInt(e.target.value))}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              min="10"
              max="120"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Additional Options */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">{t('analysisSettings.additional.title')}</h4>
        <div className="flex items-center justify-between">
          <Label htmlFor="subdomains" className="text-slate-400 cursor-pointer">
            {t('analysisSettings.additional.includeSubdomains')}
          </Label>
          <Switch
            id="subdomains"
            checked={settings.includeSubdomains}
            onCheckedChange={(checked) => updateSetting('includeSubdomains', checked)}
          />
        </div>
      </div>
    </div>
  );
};
