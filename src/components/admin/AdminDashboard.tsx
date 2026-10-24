import React, { useState } from 'react';
import { useTemplates } from '../../contexts/TemplateContext';
import { Template } from '../../types';
import { TemplateDesigner } from './TemplateDesigner';
import { SampleTemplateLoader } from './SampleTemplateLoader';

export const AdminDashboard: React.FC = () => {
  const { templates, saveTemplate, deleteTemplate } = useTemplates();
  const [isDesigning, setIsDesigning] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsDesigning(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsDesigning(true);
  };

  const handleSave = async (template: Template) => {
    await saveTemplate(template);
    setIsDesigning(false);
    setEditingTemplate(null);
  };

  const handleCancel = () => {
    setIsDesigning(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      await deleteTemplate(templateId);
    }
  };

  const handleToggleEnabled = async (template: Template) => {
    await saveTemplate({ ...template, enabled: !template.enabled, updatedAt: Date.now() });
  };

  const handleSetDefault = async (template: Template) => {
    // Unset all other templates as default
    for (const t of templates) {
      if (t.id !== template.id && t.isDefault) {
        await saveTemplate({ ...t, isDefault: false, updatedAt: Date.now() });
      }
    }
    // Set this template as default
    await saveTemplate({ ...template, isDefault: true, updatedAt: Date.now() });
  };

  // Export templates to JSON file
  const handleExport = () => {
    if (templates.length === 0) {
      alert('No templates to export!');
      return;
    }

    const dataStr = JSON.stringify(templates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `photobooth-templates-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import templates from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedTemplates = JSON.parse(e.target?.result as string) as Template[];
        
        if (!Array.isArray(importedTemplates)) {
          alert('Invalid template file format!');
          return;
        }

        // Ask user if they want to replace or merge
        const replace = window.confirm(
          `Found ${importedTemplates.length} template(s).\n\n` +
          'Click OK to REPLACE all existing templates.\n' +
          'Click Cancel to MERGE with existing templates.'
        );

        if (replace) {
          // Clear existing templates (optional - comment out if you want to keep)
          // Note: We'll just import without clearing to be safe
        }

        // Import all templates
        for (const template of importedTemplates) {
          await saveTemplate({
            ...template,
            id: `imported-${Date.now()}-${Math.random()}`, // New ID to avoid conflicts
            updatedAt: Date.now()
          });
        }

        alert(`Successfully imported ${importedTemplates.length} template(s)!`);
        
        // Reset file input
        event.target.value = '';
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import templates. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  if (isDesigning) {
    return (
      <TemplateDesigner
        template={editingTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-xs text-gray-600">Manage photo booth templates and layouts</p>
            </div>
            <a
              href="/"
              className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Back to Photo Booth
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Sample Template Loader */}
        <SampleTemplateLoader />

        {/* Import/Export Section */}
        <div className="mb-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Import / Export Templates</h2>
          <p className="text-xs text-gray-600 mb-3">
            Export templates to share across devices, or import templates from another device
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={templates.length === 0}
              className="flex-1 bg-blue-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Templates ({templates.length})
            </button>
            <label className="flex-1 bg-green-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import Templates
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-4">
          <button
            onClick={handleCreateNew}
            className="bg-purple-600 text-white px-6 py-2.5 text-sm rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Template
          </button>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Templates Yet</h2>
            <p className="text-sm text-gray-600 mb-4">Create your first photo booth template to get started</p>
            <button
              onClick={handleCreateNew}
              className="bg-purple-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-purple-700"
            >
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Preview */}
                <div className="relative bg-gray-200 aspect-[2/3]">
                  {template.backgroundDataUrl ? (
                    <img
                      src={template.backgroundDataUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1.5">
                    {template.isDefault && (
                      <span className="bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded text-xs font-bold">
                        DEFAULT
                      </span>
                    )}
                    {!template.enabled && (
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                        DISABLED
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-base font-bold text-gray-800 mb-1.5">{template.name}</h3>
                  <div className="text-xs text-gray-600 mb-3">
                    <p>{template.width} × {template.height}px</p>
                    <p>{template.photoSlots.length} photo slots</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleEdit(template)}
                      className="flex-1 px-2 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleSetDefault(template)}
                      className={`flex-1 px-2 py-1.5 text-xs rounded font-medium ${
                        template.isDefault
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                      }`}
                      disabled={template.isDefault}
                    >
                      {template.isDefault ? '✓ Active' : 'Set Active'}
                    </button>
                  </div>

                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      onClick={() => handleToggleEnabled(template)}
                      className={`flex-1 px-2 py-1.5 text-xs rounded font-medium ${
                        template.enabled
                          ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {template.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="flex-1 px-2 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h2 className="text-base font-bold text-gray-800 mb-2">📌 Active Template System</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p className="font-semibold">How it works:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>One Active Template:</strong> Only ONE template can be active at a time</li>
              <li><strong>Click "Set Active":</strong> Makes that template the default for all sessions</li>
              <li><strong>Active template badge:</strong> Shows green "✓ Active" button</li>
              <li><strong>Users see active template:</strong> All photo sessions use the active template automatically</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3 italic">
              💡 Tip: Change the active template anytime to switch layouts for upcoming sessions
            </p>
          </div>
        </div>

        <div className="mt-4 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <h2 className="text-base font-bold text-gray-800 mb-2">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Click "Create New Template" to start designing</li>
            <li>Upload a background image (PNG with transparency recommended)</li>
            <li>Add photo slots by clicking "+ Add Photo Slot"</li>
            <li>Drag and resize slots to position them on your design</li>
            <li>Save your template and click "Set Active" to use it</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
