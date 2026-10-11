import React, { useState } from 'react';
import { useTemplates } from '../../contexts/TemplateContext';
import { getSampleTemplates } from '../../utils/sampleTemplates';

export const SampleTemplateLoader: React.FC = () => {
  const { templates, saveTemplate } = useTemplates();
  const [isLoading, setIsLoading] = useState(false);

  const loadSampleTemplates = async () => {
    setIsLoading(true);
    try {
      const sampleTemplates = getSampleTemplates();
      
      for (const template of sampleTemplates) {
        await saveTemplate(template);
      }
      
      alert(`Successfully loaded ${sampleTemplates.length} sample templates!`);
    } catch (error) {
      console.error('Error loading sample templates:', error);
      alert('Failed to load sample templates. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show if no templates exist
  if (templates.length > 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Templates Found
          </h3>
          <p className="text-gray-700 mb-4">
            To get started quickly, you can load sample templates. These include:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Classic Photo Strip</strong> - Traditional 4-photo vertical layout</li>
            <li><strong>2×2 Grid</strong> - Square grid layout with 4 photos</li>
            <li><strong>Collage Style</strong> - Creative landscape collage with varied sizes</li>
          </ul>
          <p className="text-sm text-gray-600 mb-4">
            Sample templates come with pre-generated backgrounds. You can edit or delete them after loading.
          </p>
          <button
            onClick={loadSampleTemplates}
            disabled={isLoading}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-colors
              ${isLoading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }
            `}
          >
            {isLoading ? 'Loading...' : 'Load Sample Templates'}
          </button>
        </div>
      </div>
    </div>
  );
};
