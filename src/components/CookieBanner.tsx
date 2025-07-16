
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useCookies } from '@/contexts/CookieContext';
import { Cookie, Settings, Shield, BarChart, Target, User } from 'lucide-react';

const CookieBanner = () => {
  const { showBanner, acceptAll, rejectAll, updatePreferences, preferences } = useCookies();
  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);

  if (!showBanner) return null;

  const handleSaveSettings = () => {
    updatePreferences(tempPreferences);
    setShowSettings(false);
  };

  const cookieCategories = [
    {
      id: 'necessary',
      title: 'Notwendige Cookies',
      description: 'Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht deaktiviert werden.',
      icon: Shield,
      required: true,
    },
    {
      id: 'analytics',
      title: 'Analyse-Cookies',
      description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
      icon: BarChart,
      required: false,
    },
    {
      id: 'marketing',
      title: 'Marketing-Cookies',
      description: 'Diese Cookies werden verwendet, um personalisierte Werbung und Inhalte anzuzeigen.',
      icon: Target,
      required: false,
    },
    {
      id: 'preferences',
      title: 'Präferenz-Cookies',
      description: 'Diese Cookies speichern Ihre Einstellungen und Präferenzen für zukünftige Besuche.',
      icon: User,
      required: false,
    },
  ];

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
        <Card className="max-w-6xl mx-auto bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="h-8 w-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Cookie-Einstellungen</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
                    Einige sind notwendig für das Funktionieren der Seite, andere helfen uns, 
                    die Website zu verbessern und Ihnen relevante Inhalte zu zeigen.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Einstellungen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Alle ablehnen
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  Alle akzeptieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Cookie className="h-5 w-5 text-cyan-400" />
              Cookie-Einstellungen verwalten
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <p className="text-slate-300 text-sm">
              Wählen Sie aus, welche Cookies Sie zulassen möchten. Sie können diese Einstellungen 
              jederzeit über den Link in der Fußzeile ändern.
            </p>

            {cookieCategories.map((category) => {
              const IconComponent = category.icon;
              const isEnabled = tempPreferences[category.id as keyof typeof tempPreferences];
              
              return (
                <div key={category.id} className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <IconComponent className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{category.title}</h4>
                        <p className="text-slate-400 text-sm">{category.description}</p>
                        
                        {category.id === 'necessary' && (
                          <span className="inline-block mt-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                            Immer aktiv
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Switch
                      checked={isEnabled}
                      disabled={category.required}
                      onCheckedChange={(checked) => {
                        if (!category.required) {
                          setTempPreferences(prev => ({
                            ...prev,
                            [category.id]: checked
                          }));
                        }
                      }}
                      className="ml-4"
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Einstellungen speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;
