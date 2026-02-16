import React from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { AppStatus } from '../types';

interface ResultViewProps {
  status: AppStatus;
  resultImage: string | null;
  onGenerate: () => void;
  canGenerate: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({ status, resultImage, onGenerate, canGenerate }) => {
  
  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `thumbgen-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || status === AppStatus.GENERATING}
          className={`
            group relative px-8 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 shadow-xl
            ${!canGenerate 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : status === AppStatus.GENERATING
                ? 'bg-gray-800 text-white cursor-wait'
                : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 hover:shadow-primary/25'
            }
          `}
        >
          {status === AppStatus.GENERATING ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" /> Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 ${canGenerate ? 'group-hover:rotate-180 transition-transform duration-500' : ''}`} /> 
              Generate Thumbnail
            </span>
          )}
        </button>
      </div>

      {resultImage && (
        <div className="relative group rounded-xl overflow-hidden border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-700 bg-black/50">
          <img 
            src={resultImage} 
            alt="Generated Thumbnail" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
            <span className="text-white font-medium">1280x769 Generated</span>
            <button 
              onClick={handleDownload}
              className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
