import React from 'react';
import { Type, List, Tag } from 'lucide-react';
import { ThumbnailText } from '../types';

interface ConfigFormProps {
  config: ThumbnailText;
  onChange: (config: ThumbnailText) => void;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  
  const handleServiceChange = (index: number, val: string) => {
    const newServices = [...config.services];
    newServices[index] = val;
    onChange({ ...config, services: newServices });
  };

  const handleSkillChange = (index: number, val: string) => {
    const newSkills = [...config.skills];
    newSkills[index] = val;
    onChange({ ...config, skills: newSkills });
  };

  return (
    <div className="bg-surface/50 border border-white/10 rounded-xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Heading */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Type className="w-4 h-4 text-primary" /> Main Heading
        </label>
        <input 
          type="text" 
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          placeholder="e.g. Modern React Dashboard"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <List className="w-4 h-4 text-secondary" /> Left Panel: Services (3)
          </label>
          {config.services.map((service, i) => (
            <input 
              key={`svc-${i}`}
              type="text" 
              value={service}
              onChange={(e) => handleServiceChange(i, e.target.value)}
              placeholder={`Service ${i + 1}`}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all"
            />
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" /> Right Panel: Skills (4)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {config.skills.map((skill, i) => (
              <input 
                key={`skl-${i}`}
                type="text" 
                value={skill}
                onChange={(e) => handleSkillChange(i, e.target.value)}
                placeholder={`Skill ${i + 1}`}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
