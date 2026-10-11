import localforage from 'localforage';
import { Template, PhotoSession } from '../types';

// Configure localforage
const templateStore = localforage.createInstance({
  name: 'photobooth',
  storeName: 'templates'
});

const sessionStore = localforage.createInstance({
  name: 'photobooth',
  storeName: 'sessions'
});

// Template Storage
export const saveTemplate = async (template: Template): Promise<void> => {
  await templateStore.setItem(template.id, template);
};

export const getTemplate = async (id: string): Promise<Template | null> => {
  return await templateStore.getItem<Template>(id);
};

export const getAllTemplates = async (): Promise<Template[]> => {
  const templates: Template[] = [];
  await templateStore.iterate<Template, void>((value) => {
    templates.push(value);
  });
  return templates.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await templateStore.removeItem(id);
};

// Session Storage
export const saveSession = async (session: PhotoSession): Promise<void> => {
  await sessionStore.setItem(session.id, session);
};

export const getSession = async (id: string): Promise<PhotoSession | null> => {
  return await sessionStore.getItem<PhotoSession>(id);
};

export const clearSession = async (id: string): Promise<void> => {
  await sessionStore.removeItem(id);
};

// Default photo edits
export const getDefaultPhotoEdit = () => ({
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  filter: 'none' as const,
  rotation: 0,
  flipH: false,
  flipV: false,
  zoom: 1,
  cropX: 0,
  cropY: 0
});
