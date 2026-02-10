'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Save, Upload, Building2, Globe, MapPin, Phone } from 'lucide-react';

interface TenantData {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  subscriptionPlan: string;
  status: string;
}

export default function AdminSettingsClient({ tenant }: { tenant: TenantData }) {
  const [schoolName, setSchoolName] = useState(tenant.name);
  const [description, setDescription] = useState(tenant.description);
  const [websiteUrl, setWebsiteUrl] = useState(tenant.websiteUrl);
  const [address, setAddress] = useState(tenant.address);
  const [city, setCity] = useState(tenant.city);
  const [state, setState] = useState(tenant.state);
  const [postalCode, setPostalCode] = useState(tenant.postalCode);
  const [country, setCountry] = useState(tenant.country);
  const [phone, setPhone] = useState(tenant.phone);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schoolName,
          description,
          website_url: websiteUrl,
          address,
          city,
          state,
          postal_code: postalCode,
          country,
          phone,
        }),
      });

      if (response.ok) {
        setSaveMessage('Settings saved successfully!');
      } else {
        setSaveMessage('Failed to save settings. Please try again.');
      }
    } catch {
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              School Settings
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Configure your school and platform settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-200 capitalize">
              {tenant.subscriptionPlan}
            </Badge>
            <Badge className={tenant.status === 'active' ? 'bg-green-500/20 text-green-700 dark:text-green-200' : 'bg-red-500/20 text-red-700 dark:text-red-200'}>
              {tenant.status}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    School Name
                  </label>
                  <Input
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    School Code (Slug)
                  </label>
                  <Input
                    value={tenant.slug}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This is used for joining the school. Share this code with new users.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe your school..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                {saveMessage && (
                  <p className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage}
                  </p>
                )}

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>School Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenant.logoUrl && (
                  <div className="flex justify-center">
                    <img
                      src={tenant.logoUrl}
                      alt="School Logo"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Drag and drop your logo here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Address Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Street Address
                  </label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 School St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      City
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      State / Province
                    </label>
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Postal Code
                    </label>
                    <Input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Country
                    </label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                {saveMessage && (
                  <p className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage}
                  </p>
                )}

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Subscription Plan</p>
                    <p className="text-sm text-slate-500">{tenant.subscriptionPlan} plan</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-200 capitalize">
                    {tenant.subscriptionPlan}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Tenant ID</p>
                    <code className="text-xs text-slate-500 font-mono">{tenant.id}</code>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Reset System
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
