
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useCookies } from '@/contexts/CookieContext';
import { Cookie, Shield, BarChart, Target, User, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CookieEinstellungen = () => {
  const { preferences, updatePreferences } = useCookies();
  const [tempPreferences, setTempPreferences] = useState(preferences);

  const handleSave = () => {
    updatePreferences(tempPreferences);
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Cookie-Präferenzen wurden erfolgreich aktualisiert.",
    });
  };

  const cookieCategories = [
    {
      id: 'necessary',
      title: 'Notwendige Cookies',
      description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich. Sie ermöglichen grundlegende Funktionen wie Seitennavigation und Zugriff auf sichere Bereiche der Website.',
      icon: Shield,
      required: true,
      details: [
        'Session-Management',
        'Sicherheitsfeatures',
        'Grundlegende Website-Funktionalität',
      ],
      duration: 'Session / 1 Jahr',
    },
    {
      id: 'analytics',
      title: 'Analyse-Cookies',
      description: 'Diese Cookies sammeln Informationen darüber, wie Besucher unsere Website nutzen. Alle Informationen werden anonymisiert und helfen uns, die Website-Leistung zu verbessern.',
      icon: BarChart,
      required: false,
      details: [
        'Website-Nutzungsstatistiken',
        'Leistungsmetriken',
        'Fehlerberichterstattung',
      ],
      duration: '2 Jahre',
    },
    {
      id: 'marketing',
      title: 'Marketing-Cookies',
      description: 'Diese Cookies werden verwendet, um Werbung relevanter zu machen und die Effektivität von Werbekampagnen zu messen.',
      icon: Target,
      required: false,
      details: [
        'Personalisierte Werbung',
        'Kampagnen-Tracking',
        'Retargeting',
      ],
      duration: '1 Jahr',
    },
    {
      id: 'preferences',
      title: 'Präferenz-Cookies',
      description: 'Diese Cookies ermöglichen es der Website, sich an Ihre Entscheidungen zu erinnern und Ihnen erweiterte, personalisiertere Funktionen zu bieten.',
      icon: User,
      required: false,
      details: [
        'Sprach- und Regionspräferenzen',
        'UI-Einstellungen',
        'Personalisierte Inhalte',
      ],
      duration: '1 Jahr',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Startseite
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Cookie-Einstellungen</h1>
          </div>
          
          <p className="text-slate-300 max-w-3xl">
            Hier können Sie Ihre Cookie-Präferenzen verwalten. Wir respektieren Ihre Privatsphäre 
            und geben Ihnen die volle Kontrolle darüber, welche Cookies auf Ihrem Gerät gespeichert werden.
          </p>
        </div>

        {/* Cookie Categories */}
        <div className="space-y-6 mb-8">
          {cookieCategories.map((category) => {
            const IconComponent = category.icon;
            const isEnabled = tempPreferences[category.id as keyof typeof tempPreferences];
            
            return (
              <Card key={category.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-6 w-6 text-cyan-400 mt-1" />
                      <div>
                        <CardTitle className="text-white mb-2">{category.title}</CardTitle>
                        <p className="text-slate-300 text-sm">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {category.required && (
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                          Erforderlich
                        </span>
                      )}
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
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Verwendungszwecke:</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        {category.details.map((detail, index) => (
                          <li key={index}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Speicherdauer:</h4>
                      <p className="text-slate-400 text-sm">{category.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1">Änderungen speichern</h3>
                <p className="text-slate-400 text-sm">
                  Klicken Sie auf "Speichern", um Ihre Cookie-Präferenzen zu aktualisieren.
                </p>
              </div>
              
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Einstellungen speichern
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6 bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-3">Weitere Informationen</h3>
            <div className="text-slate-300 text-sm space-y-2">
              <p>
                Wenn Sie Fragen zu unseren Cookie-Richtlinien haben, kontaktieren Sie uns unter{' '}
                <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:text-cyan-300">
                  hi@inspiroware.com
                </a>
              </p>
              <p>
                Weitere Informationen finden Sie in unserer{' '}
                <Link to="/datenschutz" className="text-cyan-400 hover:text-cyan-300">
                  Datenschutzerklärung
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookieEinstellungen;
