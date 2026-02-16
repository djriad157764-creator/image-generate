import React, { useState } from 'react';
import { Header } from './components/Header';
import { AssetUploader } from './components/AssetUploader';
import { ConfigForm } from './components/ConfigForm';
import { ResultView } from './components/ResultView';
import { generateThumbnail } from './services/geminiService';
import { AppStatus, ThumbnailAssets, ThumbnailText } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const [assets, setAssets] = useState<ThumbnailAssets>({
    laptop: null,
    mobile: null,
    code: null,
    output: null,
  });

  const [textConfig, setTextConfig] = useState<ThumbnailText>({
    heading: '',
    services: ['', '', ''],
    skills: ['', '', '', ''],
  });

  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleAssetChange = (key: keyof ThumbnailAssets, base64: string) => {
    setAssets(prev => ({ ...prev, [key]: base64 }));
  };

  const isFormValid = Boolean(
    assets.laptop && 
    assets.mobile && 
    assets.code && 
    assets.output && 
    textConfig.heading.trim()
  );

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setStatus(AppStatus.GENERATING);
    setError(null);
    setResultImage(null);

    try {
      const generatedBase64 = await generateThumbnail({
        laptopImage: assets.laptop!,
        mobileImage: assets.mobile!,
        codeImage: assets.code!,
        outputImage: assets.output!,
        heading: textConfig.heading,
        services: textConfig.services.filter(s => s.trim()),
        skills: textConfig.skills.filter(s => s.trim()),
      });
      setResultImage(generatedBase64);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate thumbnail. Please try again.');
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Create Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Fiverr Thumbnails</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload your screenshots and let AI stage them in professional 3D devices with perfect layout and typography.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <AssetUploader assets={assets} onAssetChange={handleAssetChange} />
             <ConfigForm config={textConfig} onChange={setTextConfig} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface/30 backdrop-blur-md border border-white/5 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Preview</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex justify-between">
                   <span>Assets Ready</span>
                   <span className={Object.values(assets).every(v => v) ? "text-green-400" : "text-gray-600"}>
                     {Object.values(assets).filter(Boolean).length}/4
                   </span>
                </div>
                <div className="flex justify-between">
                   <span>Heading Set</span>
                   <span className={textConfig.heading ? "text-green-400" : "text-gray-600"}>
                     {textConfig.heading ? 'Yes' : 'No'}
                   </span>
                </div>
              </div>
              
              <div className="mt-8">
                <ResultView 
                  status={status} 
                  resultImage={resultImage} 
                  onGenerate={handleGenerate}
                  canGenerate={isFormValid}
                />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
