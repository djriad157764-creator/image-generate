import React, { useState } from 'react';
import { Upload, Monitor, Smartphone, Code, Layout, CheckCircle2 } from 'lucide-react';
import { ThumbnailAssets } from '../types';

interface AssetUploaderProps {
  assets: ThumbnailAssets;
  onAssetChange: (key: keyof ThumbnailAssets, base64: string) => void;
}

const AssetBox: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string | null;
  onChange: (base64: string) => void;
}> = ({ label, icon, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div 
      className={`relative group aspect-video rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden
        ${value ? 'border-primary/50 bg-primary/5' : isDragging ? 'border-secondary bg-secondary/10' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      
      {value ? (
        <>
          <img src={value} alt={label} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500/20 text-green-400 p-2 rounded-full backdrop-blur-md border border-green-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm p-2 rounded-lg text-xs text-white border border-white/10 text-center z-10">
            {label}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className={`p-3 rounded-full mb-3 transition-colors ${isDragging ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
            {icon}
          </div>
          <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</p>
          <p className="text-xs text-gray-500 mt-1">Drag or click</p>
        </div>
      )}
    </div>
  );
};

export const AssetUploader: React.FC<AssetUploaderProps> = ({ assets, onAssetChange }) => {
  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" />
        Upload Assets
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AssetBox 
          label="Main Laptop" 
          icon={<Monitor className="w-6 h-6" />} 
          value={assets.laptop} 
          onChange={(val) => onAssetChange('laptop', val)} 
        />
        <AssetBox 
          label="Smartphone" 
          icon={<Smartphone className="w-6 h-6" />} 
          value={assets.mobile} 
          onChange={(val) => onAssetChange('mobile', val)} 
        />
        <AssetBox 
          label="Tailwind Code" 
          icon={<Code className="w-6 h-6" />} 
          value={assets.code} 
          onChange={(val) => onAssetChange('code', val)} 
        />
        <AssetBox 
          label="Tailwind Output" 
          icon={<Layout className="w-6 h-6" />} 
          value={assets.output} 
          onChange={(val) => onAssetChange('output', val)} 
        />
      </div>
    </div>
  );
};
