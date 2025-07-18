
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { GooglePageSpeedService } from '@/services/GooglePageSpeedService';
import { GoogleCustomSearchService } from '@/services/GoogleCustomSearchService';
import { toast } from '@/hooks/use-toast';

export const ApiKeySettings: React.FC = () => {
  const [pageSpeedApiKey, setPageSpeedApiKey] = useState('');
  const [searchApiKey, setSearchApiKey] = useState('');
  const [searchEngineId, setSearchEngineId] = useState('');
  const [yelpApiKey, setYelpApiKey] = useState('');
  const [placesApiKey, setPlacesApiKey] = useState('');
  const [hunterApiKey, setHunterApiKey] = useState('');
  const [isTestingPageSpeed, setIsTestingPageSpeed] = useState(false);
  const [isTestingSearch, setIsTestingSearch] = useState(false);
  const [isTestingYelp, setIsTestingYelp] = useState(false);
  const [isTestingPlaces, setIsTestingPlaces] = useState(false);
  const [isTestingHunter, setIsTestingHunter] = useState(false);

  const pageSpeedService = new GooglePageSpeedService();
  const searchService = new GoogleCustomSearchService();

  const handleSavePageSpeedKey = async () => {
    if (!pageSpeedApiKey.trim()) {
      toast({
        title: "API Key fehlt",
        description: "Bitte geben Sie einen gültigen PageSpeed API Key ein",
        variant: "destructive",
      });
      return;
    }

    setIsTestingPageSpeed(true);
    
    try {
      pageSpeedService.setApiKey(pageSpeedApiKey);
      
      // Test the API key with a simple request
      const testResult = await pageSpeedService.analyzePageSpeed('google.com');
      
      if (testResult) {
        toast({
          title: "PageSpeed API Key gespeichert",
          description: "API Key erfolgreich getestet und gespeichert",
        });
        setPageSpeedApiKey('');
      } else {
        throw new Error('API Test fehlgeschlagen');
      }
      
    } catch (error) {
      toast({
        title: "API Key Test fehlgeschlagen",
        description: "Überprüfen Sie Ihren PageSpeed API Key",
        variant: "destructive",
      });
    } finally {
      setIsTestingPageSpeed(false);
    }
  };

  const handleSaveSearchCredentials = async () => {
    if (!searchApiKey.trim() || !searchEngineId.trim()) {
      toast({
        title: "Credentials fehlen",
        description: "Bitte geben Sie API Key und Search Engine ID ein",
        variant: "destructive",
      });
      return;
    }

    setIsTestingSearch(true);
    
    try {
      searchService.setCredentials(searchApiKey, searchEngineId);
      
      // Test the credentials with a simple search
      const testResult = await searchService.searchDomains('test', '.com', 1);
      
      if (testResult.domains.length >= 0) { // Even 0 results is a successful API call
        toast({
          title: "Search API Credentials gespeichert",
          description: "Credentials erfolgreich getestet und gespeichert",
        });
        setSearchApiKey('');
        setSearchEngineId('');
      } else {
        throw new Error('API Test fehlgeschlagen');
      }
      
    } catch (error) {
      toast({
        title: "Credentials Test fehlgeschlagen",
        description: "Überprüfen Sie Ihre Search API Credentials",
        variant: "destructive",
      });
    } finally {
      setIsTestingSearch(false);
    }
  };

  const handleSaveYelpKey = async () => {
    if (!yelpApiKey.trim()) {
      toast({
        title: "API Key fehlt",
        description: "Bitte geben Sie einen gültigen Yelp API Key ein",
        variant: "destructive",
      });
      return;
    }

    setIsTestingYelp(true);
    
    try {
      localStorage.setItem('yelp_api_key', yelpApiKey);
      
      // Test API with a simple request
      const response = await fetch('https://api.yelp.com/v3/businesses/search?location=Berlin&term=restaurant&limit=1', {
        headers: { 'Authorization': `Bearer ${yelpApiKey}` }
      });
      
      if (response.ok) {
        toast({
          title: "Yelp API Key gespeichert",
          description: "API Key erfolgreich getestet und gespeichert",
        });
        setYelpApiKey('');
      } else {
        throw new Error('API Test fehlgeschlagen');
      }
      
    } catch (error) {
      toast({
        title: "Yelp API Key Test fehlgeschlagen",
        description: "Überprüfen Sie Ihren Yelp API Key",
        variant: "destructive",
      });
    } finally {
      setIsTestingYelp(false);
    }
  };

  const handleSavePlacesKey = async () => {
    if (!placesApiKey.trim()) {
      toast({
        title: "API Key fehlt",
        description: "Bitte geben Sie einen gültigen Google Places API Key ein",
        variant: "destructive",
      });
      return;
    }

    setIsTestingPlaces(true);
    
    try {
      localStorage.setItem('google_places_key', placesApiKey);
      
      // Test API with a simple request
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+Berlin&key=${placesApiKey}`);
      
      if (response.ok) {
        toast({
          title: "Google Places API Key gespeichert",
          description: "API Key erfolgreich getestet und gespeichert",
        });
        setPlacesApiKey('');
      } else {
        throw new Error('API Test fehlgeschlagen');
      }
      
    } catch (error) {
      toast({
        title: "Places API Key Test fehlgeschlagen",
        description: "Überprüfen Sie Ihren Google Places API Key",
        variant: "destructive",
      });
    } finally {
      setIsTestingPlaces(false);
    }
  };

  const handleSaveHunterKey = async () => {
    if (!hunterApiKey.trim()) {
      toast({
        title: "API Key fehlt",
        description: "Bitte geben Sie einen gültigen Hunter.io API Key ein",
        variant: "destructive",
      });
      return;
    }

    setIsTestingHunter(true);
    
    try {
      localStorage.setItem('hunter_api_key', hunterApiKey);
      
      // Test API with a simple request
      const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=example.com&api_key=${hunterApiKey}`);
      
      if (response.ok) {
        toast({
          title: "Hunter.io API Key gespeichert",
          description: "API Key erfolgreich getestet und gespeichert",
        });
        setHunterApiKey('');
      } else {
        throw new Error('API Test fehlgeschlagen');
      }
      
    } catch (error) {
      toast({
        title: "Hunter.io API Key Test fehlgeschlagen",
        description: "Überprüfen Sie Ihren Hunter.io API Key",
        variant: "destructive",
      });
    } finally {
      setIsTestingHunter(false);
    }
  };

  const hasPageSpeedKey = pageSpeedService.hasApiKey();
  const hasSearchCredentials = searchService.hasCredentials();
  const hasYelpKey = !!localStorage.getItem('yelp_api_key');
  const hasPlacesKey = !!localStorage.getItem('google_places_key');
  const hasHunterKey = !!localStorage.getItem('hunter_api_key');

  return (
    <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Key className="h-5 w-5 mr-2 text-cyan-400" />
          API-Integration Einstellungen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google PageSpeed Insights API */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Google PageSpeed Insights API</Label>
            {hasPageSpeedKey ? (
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Konfiguriert
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Nicht konfiguriert
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="API Key eingeben..."
              value={pageSpeedApiKey}
              onChange={(e) => setPageSpeedApiKey(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button 
              onClick={handleSavePageSpeedKey}
              disabled={isTestingPageSpeed}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isTestingPageSpeed ? 'Teste...' : 'Speichern'}
            </Button>
          </div>
          
          <p className="text-xs text-slate-400">
            Kostenlos bis 25.000 Abfragen/Tag. 
            <a href="https://developers.google.com/speed/docs/insights/v5/get-started" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:underline ml-1">
              API Key erstellen <ExternalLink className="h-3 w-3 inline" />
            </a>
          </p>
        </div>

        {/* Google Custom Search API */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Google Custom Search API</Label>
            {hasSearchCredentials ? (
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Konfiguriert
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Nicht konfiguriert
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="API Key eingeben..."
              value={searchApiKey}
              onChange={(e) => setSearchApiKey(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Input
              type="text"
              placeholder="Search Engine ID eingeben..."
              value={searchEngineId}
              onChange={(e) => setSearchEngineId(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button 
              onClick={handleSaveSearchCredentials}
              disabled={isTestingSearch}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {isTestingSearch ? 'Teste...' : 'Speichern'}
            </Button>
          </div>
          
          <p className="text-xs text-slate-400">
            100 kostenlose Abfragen/Tag, dann $5/1000 Abfragen.
            <a href="https://developers.google.com/custom-search/v1/introduction" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:underline ml-1">
              Setup-Anleitung <ExternalLink className="h-3 w-3 inline" />
            </a>
          </p>
        </div>

        {/* Yelp API */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Yelp Fusion API</Label>
            {hasYelpKey ? (
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Konfiguriert
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Nicht konfiguriert
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="Yelp API Key eingeben..."
              value={yelpApiKey}
              onChange={(e) => setYelpApiKey(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button 
              onClick={handleSaveYelpKey}
              disabled={isTestingYelp}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isTestingYelp ? 'Teste...' : 'Speichern'}
            </Button>
          </div>
          
          <p className="text-xs text-slate-400">
            5000 kostenlose API-Calls/Monat für lokale Business-Suche.
            <a href="https://docs.developer.yelp.com/docs/fusion-intro" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:underline ml-1">
              API Key erstellen <ExternalLink className="h-3 w-3 inline" />
            </a>
          </p>
        </div>

        {/* Google Places API */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Google Places API</Label>
            {hasPlacesKey ? (
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Konfiguriert
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Nicht konfiguriert
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="Google Places API Key eingeben..."
              value={placesApiKey}
              onChange={(e) => setPlacesApiKey(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button 
              onClick={handleSavePlacesKey}
              disabled={isTestingPlaces}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isTestingPlaces ? 'Teste...' : 'Speichern'}
            </Button>
          </div>
          
          <p className="text-xs text-slate-400">
            $200 gratis-Guthaben/Monat für lokale Business-Discovery.
            <a href="https://developers.google.com/maps/documentation/places/web-service/get-api-key" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:underline ml-1">
              API Key erstellen <ExternalLink className="h-3 w-3 inline" />
            </a>
          </p>
        </div>

        {/* Hunter.io API */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Hunter.io API</Label>
            {hasHunterKey ? (
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Konfiguriert
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Nicht konfiguriert
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="Hunter.io API Key eingeben..."
              value={hunterApiKey}
              onChange={(e) => setHunterApiKey(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button 
              onClick={handleSaveHunterKey}
              disabled={isTestingHunter}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isTestingHunter ? 'Teste...' : 'Speichern'}
            </Button>
          </div>
          
          <p className="text-xs text-slate-400">
            100 kostenlose Abfragen/Monat für Domain-Intelligence.
            <a href="https://hunter.io/api-documentation" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:underline ml-1">
              API Key erstellen <ExternalLink className="h-3 w-3 inline" />
            </a>
          </p>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            Common Crawl API ist kostenlos und benötigt keine Konfiguration.
            API Keys werden sicher im Browser gespeichert.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
