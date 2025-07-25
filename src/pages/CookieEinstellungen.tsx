
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useCookies } from '@/contexts/CookieContext';
import { Cookie, Shield, BarChart, Target, User, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const CookieEinstellungen = () => {
  const { t } = useTranslation('legal');
  const { preferences, updatePreferences } = useCookies();
  const [tempPreferences, setTempPreferences] = useState(preferences);

  const handleSave = () => {
    updatePreferences(tempPreferences);
    toast({
      title: t('cookies.savedToast'),
      description: t('cookies.savedDescription'),
    });
  };

  const cookieCategories = [
    {
      id: 'necessary',
      title: t('cookies.categories.necessary.title'),
      description: t('cookies.categories.necessary.description'),
      icon: Shield,
      required: true,
      details: [
        t('cookies.categories.necessary.detail1'),
        t('cookies.categories.necessary.detail2'),
        t('cookies.categories.necessary.detail3'),
      ],
      duration: t('cookies.categories.necessary.duration'),
    },
    {
      id: 'analytics',
      title: t('cookies.categories.analytics.title'),
      description: t('cookies.categories.analytics.description'),
      icon: BarChart,
      required: false,
      details: [
        t('cookies.categories.analytics.detail1'),
        t('cookies.categories.analytics.detail2'),
        t('cookies.categories.analytics.detail3'),
      ],
      duration: t('cookies.categories.analytics.duration'),
    },
    {
      id: 'marketing',
      title: t('cookies.categories.marketing.title'),
      description: t('cookies.categories.marketing.description'),
      icon: Target,
      required: false,
      details: [
        t('cookies.categories.marketing.detail1'),
        t('cookies.categories.marketing.detail2'),
        t('cookies.categories.marketing.detail3'),
      ],
      duration: t('cookies.categories.marketing.duration'),
    },
    {
      id: 'preferences',
      title: t('cookies.categories.preferences.title'),
      description: t('cookies.categories.preferences.description'),
      icon: User,
      required: false,
      details: [
        t('cookies.categories.preferences.detail1'),
        t('cookies.categories.preferences.detail2'),
        t('cookies.categories.preferences.detail3'),
      ],
      duration: t('cookies.categories.preferences.duration'),
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
            {t('common.backToHome')}
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">{t('cookies.title')}</h1>
          </div>
          
          <p className="text-slate-300 max-w-3xl">
            {t('cookies.description')}
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
                          {t('cookies.required')}
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
                      <h4 className="text-white font-medium mb-2">{t('cookies.purposesTitle')}</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        {category.details.map((detail, index) => (
                          <li key={index}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">{t('cookies.durationTitle')}</h4>
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
                <h3 className="text-white font-semibold mb-1">{t('cookies.saveChanges')}</h3>
                <p className="text-slate-400 text-sm">
                  {t('cookies.saveDescription')}
                </p>
              </div>
              
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {t('cookies.saveButton')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6 bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-3">{t('cookies.additionalInfo')}</h3>
            <div className="text-slate-300 text-sm space-y-2">
              <p>
                {t('cookies.contactInfo')}{' '}
                <a href={`mailto:${t('common.email')}`} className="text-cyan-400 hover:text-cyan-300">
                  {t('common.email')}
                </a>
              </p>
              <p>
                {t('cookies.privacyInfo')}{' '}
                <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  {t('cookies.privacyLink')}
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
