
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Globe, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DomainSearchFormProps {
  onSearchStart: (domains: string[], searchType: string, searchOptions?: any) => void;
  isAnalyzing: boolean;
}

export const DomainSearchForm: React.FC<DomainSearchFormProps> = ({ 
  onSearchStart, 
  isAnalyzing 
}) => {
  const { t } = useTranslation('app');
  const [searchType, setSearchType] = useState('manual');
  const [domainList, setDomainList] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTLD, setSelectedTLD] = useState('.de');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'manual') {
      const domains = domainList
        .split('\n')
        .map(domain => domain.trim())
        .filter(domain => domain.length > 0);
      
      if (domains.length > 0) {
        onSearchStart(domains, 'manual');
      }
    } else if (searchType === 'automated') {
      const searchOptions = {
        query: searchQuery,
        industry,
        location,
        tld: selectedTLD,
        maxResults: 10
      };
      onSearchStart([searchQuery], 'automated', searchOptions);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={searchType} onValueChange={setSearchType}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="manual" className="data-[state=active]:bg-slate-700">
            <Upload className="h-4 w-4 mr-2" />
            {t('domainSearch.tabs.manual')}
          </TabsTrigger>
          <TabsTrigger value="automated" className="data-[state=active]:bg-slate-700">
            <Target className="h-4 w-4 mr-2" />
            {t('domainSearch.tabs.automated')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div>
            <Label htmlFor="domains" className="text-slate-300">
              {t('domainSearch.manual.label')}
            </Label>
            <Textarea
              id="domains"
              placeholder={t('domainSearch.manual.placeholder')}
              value={domainList}
              onChange={(e) => setDomainList(e.target.value)}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              rows={6}
            />
          </div>
        </TabsContent>

        <TabsContent value="automated" className="space-y-4">
          <div>
            <Label htmlFor="query" className="text-slate-300">
              {t('domainSearch.automated.searchTerm')}
            </Label>
            <Input
              id="query"
              placeholder={t('domainSearch.automated.searchTermPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry" className="text-slate-300">
                {t('domainSearch.automated.industry')}
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder={t('domainSearch.automated.industryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medizin">{t('domainSearch.automated.industries.medizin')}</SelectItem>
                  <SelectItem value="handwerk">{t('domainSearch.automated.industries.handwerk')}</SelectItem>
                  <SelectItem value="gastronomie">{t('domainSearch.automated.industries.gastronomie')}</SelectItem>
                  <SelectItem value="einzelhandel">{t('domainSearch.automated.industries.einzelhandel')}</SelectItem>
                  <SelectItem value="dienstleistung">{t('domainSearch.automated.industries.dienstleistung')}</SelectItem>
                  <SelectItem value="technologie">{t('domainSearch.automated.industries.technologie')}</SelectItem>
                  <SelectItem value="bildung">{t('domainSearch.automated.industries.bildung')}</SelectItem>
                  <SelectItem value="immobilien">{t('domainSearch.automated.industries.immobilien')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location" className="text-slate-300">
                {t('domainSearch.automated.location')}
              </Label>
              <Input
                id="location"
                placeholder={t('domainSearch.automated.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tld" className="text-slate-300">
              {t('domainSearch.automated.tld')}
            </Label>
            <Select value={selectedTLD} onValueChange={setSelectedTLD}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=".de">{t('domainSearch.automated.tlds.de')}</SelectItem>
                <SelectItem value=".com">{t('domainSearch.automated.tlds.com')}</SelectItem>
                <SelectItem value=".org">{t('domainSearch.automated.tlds.org')}</SelectItem>
                <SelectItem value=".net">{t('domainSearch.automated.tlds.net')}</SelectItem>
                <SelectItem value=".at">{t('domainSearch.automated.tlds.at')}</SelectItem>
                <SelectItem value=".ch">{t('domainSearch.automated.tlds.ch')}</SelectItem>
                <SelectItem value=".eu">{t('domainSearch.automated.tlds.eu')}</SelectItem>
                <SelectItem value=".info">{t('domainSearch.automated.tlds.info')}</SelectItem>
                <SelectItem value=".biz">{t('domainSearch.automated.tlds.biz')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Search className="h-4 w-4 mr-2 animate-spin" />
            {t('domainSearch.buttons.analyzing')}
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            {t('domainSearch.buttons.startAnalysis')}
          </>
        )}
      </Button>
    </form>
  );
};
