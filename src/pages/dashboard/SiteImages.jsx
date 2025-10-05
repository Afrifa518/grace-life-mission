import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const ImageCard = ({ title, keyName, currentUrl, onUpload, onSetUrl }) => {
  const fileRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64">
          <div className="aspect-video md:aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img src={currentUrl} alt={`${title} preview`} className="w-full h-full object-contain" />
          </div>
          <p className="text-xs text-gray-500 mt-2 break-all">{currentUrl}</p>
        </div>
        <div className="flex-1 w-full space-y-3">
          <div className="flex gap-2 items-center flex-wrap">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0] || null)} />
            <Button type="button" onClick={() => fileRef.current?.click()}>Upload new</Button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or set from URL</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={() => onSetUrl(urlInput)}>Save URL</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SiteImages = () => {
  const { images, loading, uploadAndSet, setImageUrl } = useSiteConfigContext();
  const { toast } = useToast();

  const handleUpload = async (key, file) => {
    if (!file) return;
    try {
      await uploadAndSet(key, file);
      toast({ title: 'Updated', description: `${key} updated successfully` });
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleSetUrl = async (key, url) => {
    try {
      await setImageUrl(key, url);
      toast({ title: 'Updated', description: `${key} set successfully` });
    } catch (err) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Site Images - Media Dashboard</title>
        <meta name="description" content="Manage site-wide images like page heroes, welcome section, and footer background." />
      </Helmet>

      <div>
        <h2 className="text-3xl font-bold text-gray-900">Site Images</h2>
        <p className="text-gray-600 mt-2">Update global images used across the website. Changes apply immediately.</p>
        {loading && <p className="text-sm text-gray-500 mt-2">Loading current configuration...</p>}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ImageCard title="Home Hero" keyName="homeHeroUrl" currentUrl={images.homeHeroUrl}
          onUpload={(file) => handleUpload('homeHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('homeHeroUrl', url)} />

        <ImageCard title="Home Welcome Section" keyName="homeWelcomeUrl" currentUrl={images.homeWelcomeUrl}
          onUpload={(file) => handleUpload('homeWelcomeUrl', file)}
          onSetUrl={(url) => handleSetUrl('homeWelcomeUrl', url)} />

        <ImageCard title="About Hero" keyName="aboutHeroUrl" currentUrl={images.aboutHeroUrl}
          onUpload={(file) => handleUpload('aboutHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('aboutHeroUrl', url)} />

        <ImageCard title="Sermons Hero" keyName="sermonsHeroUrl" currentUrl={images.sermonsHeroUrl}
          onUpload={(file) => handleUpload('sermonsHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('sermonsHeroUrl', url)} />

        <ImageCard title="Events Hero" keyName="eventsHeroUrl" currentUrl={images.eventsHeroUrl}
          onUpload={(file) => handleUpload('eventsHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('eventsHeroUrl', url)} />

        <ImageCard title="Ministries Hero" keyName="ministriesHeroUrl" currentUrl={images.ministriesHeroUrl}
          onUpload={(file) => handleUpload('ministriesHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('ministriesHeroUrl', url)} />

        <ImageCard title="Donations Hero" keyName="donationsHeroUrl" currentUrl={images.donationsHeroUrl}
          onUpload={(file) => handleUpload('donationsHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('donationsHeroUrl', url)} />

        <ImageCard title="Contact Hero" keyName="contactHeroUrl" currentUrl={images.contactHeroUrl}
          onUpload={(file) => handleUpload('contactHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('contactHeroUrl', url)} />

        <ImageCard title="Gallery Hero" keyName="galleryHeroUrl" currentUrl={images.galleryHeroUrl}
          onUpload={(file) => handleUpload('galleryHeroUrl', file)}
          onSetUrl={(url) => handleSetUrl('galleryHeroUrl', url)} />

        <ImageCard title="Footer Background" keyName="footerBackgroundUrl" currentUrl={images.footerBackgroundUrl}
          onUpload={(file) => handleUpload('footerBackgroundUrl', file)}
          onSetUrl={(url) => handleSetUrl('footerBackgroundUrl', url)} />
      </div>

      <div className="text-sm text-gray-500">
        <p>Notes:</p>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li>Images are stored in the Supabase Storage bucket <code>site/images</code>.</li>
          <li>If Supabase is not configured, uploads will be unavailable; existing defaults will be used.</li>
        </ul>
      </div>
    </div>
  );
};

export default SiteImages;
