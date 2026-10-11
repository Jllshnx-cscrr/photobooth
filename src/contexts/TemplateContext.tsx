import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Template } from '../types';
import { getAllTemplates, saveTemplate as saveTemplateToStorage, deleteTemplate as deleteTemplateFromStorage } from '../utils/storage';

interface TemplateContextType {
  templates: Template[];
  loadTemplates: () => Promise<void>;
  saveTemplate: (template: Template) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getEnabledTemplates: () => Template[];
  getDefaultTemplate: () => Template | null;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplates must be used within TemplateProvider');
  }
  return context;
};

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [templates, setTemplates] = useState<Template[]>([]);

  const loadTemplates = useCallback(async () => {
    const allTemplates = await getAllTemplates();
    setTemplates(allTemplates);
  }, []);

  const saveTemplate = useCallback(async (template: Template) => {
    await saveTemplateToStorage(template);
    await loadTemplates();
  }, [loadTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    await deleteTemplateFromStorage(id);
    await loadTemplates();
  }, [loadTemplates]);

  const getEnabledTemplates = useCallback(() => {
    return templates.filter((t) => t.enabled);
  }, [templates]);

  const getDefaultTemplate = useCallback(() => {
    const defaultTemplate = templates.find((t) => t.isDefault && t.enabled);
    if (defaultTemplate) return defaultTemplate;
    const firstEnabled = templates.find((t) => t.enabled);
    return firstEnabled || null;
  }, [templates]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        loadTemplates,
        saveTemplate,
        deleteTemplate,
        getEnabledTemplates,
        getDefaultTemplate
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
