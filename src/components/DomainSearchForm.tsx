
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Globe, Target } from 'lucide-react';

interface DomainSearchFormProps {
  onSearchStart: (domains: string[], searchType: string, searchOptions?: any) => void;
  isAnalyzing: boolean;
}

export const DomainSearchForm: React.FC<DomainSearchFormProps> = ({ 
  onSearchStart, 
  isAnalyzing 
}) => {
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
            Manuell
          </TabsTrigger>
          <TabsTrigger value="automated" className="data-[state=active]:bg-slate-700">
            <Target className="h-4 w-4 mr-2" />
            Automatisch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div>
            <Label htmlFor="domains" className="text-slate-300">
              Domain-Liste (eine pro Zeile)
            </Label>
            <Textarea
              id="domains"
              placeholder="beispiel.de&#10;meine-website.com&#10;test-domain.org"
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
              Suchbegriff
            </Label>
            <Input
              id="query"
              placeholder="medizin, handwerker, restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry" className="text-slate-300">
                Branche
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Branche wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medizin">Medizin & Gesundheit</SelectItem>
                  <SelectItem value="handwerk">Handwerk & Bau</SelectItem>
                  <SelectItem value="gastronomie">Gastronomie & Hotel</SelectItem>
                  <SelectItem value="einzelhandel">Einzelhandel & E-Commerce</SelectItem>
                  <SelectItem value="dienstleistung">Dienstleistung & Beratung</SelectItem>
                  <SelectItem value="technologie">IT & Technologie</SelectItem>
                  <SelectItem value="bildung">Bildung & Ausbildung</SelectItem>
                  <SelectItem value="immobilien">Immobilien</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location" className="text-slate-300">
                Ort/Region
              </Label>
              <Input
                id="location"
                placeholder="Berlin, München, NRW..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tld" className="text-slate-300">
              Top-Level-Domain (TLD)
            </Label>
            <Select value={selectedTLD} onValueChange={setSelectedTLD}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=".de">🇩🇪 .de (Deutschland)</SelectItem>
                <SelectItem value=".com">🌍 .com (International)</SelectItem>
                <SelectItem value=".org">🏛️ .org (Organisation)</SelectItem>
                <SelectItem value=".net">🌐 .net (Netzwerk)</SelectItem>
                <SelectItem value=".at">🇦🇹 .at (Österreich)</SelectItem>
                <SelectItem value=".ch">🇨🇭 .ch (Schweiz)</SelectItem>
                <SelectItem value=".eu">🇪🇺 .eu (Europa)</SelectItem>
                <SelectItem value=".info">ℹ️ .info (Information)</SelectItem>
                <SelectItem value=".biz">💼 .biz (Business)</SelectItem>
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
            Analysiere...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Analyse starten
          </>
        )}
      </Button>
    </form>
  );
};
