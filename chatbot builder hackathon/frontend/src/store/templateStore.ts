import create from 'zustand';
import { templateApi } from '../services/api';

interface TemplateState {
  templates: any[];
  selectedTemplate: any | null;
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  fetchTemplatesByCategory: (category: string) => Promise<void>;
  createTemplate: (data: any) => Promise<void>;
  updateTemplate: (id: string, data: any) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setSelectedTemplate: (template: any) => void;
}

const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,

  fetchTemplates: async () => {
    try {
      set({ loading: true, error: null });
      const response = await templateApi.getTemplates();
      set({ templates: response.data });
    } catch (error) {
      set({ error: 'Failed to fetch templates' });
      console.error('Error fetching templates:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTemplatesByCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const response = await templateApi.getTemplatesByCategory(category);
      set({ templates: response.data });
    } catch (error) {
      set({ error: 'Failed to fetch templates by category' });
      console.error('Error fetching templates by category:', error);
    } finally {
      set({ loading: false });
    }
  },

  createTemplate: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await templateApi.createTemplate(data);
      set((state) => ({
        templates: [...state.templates, response.data],
      }));
    } catch (error) {
      set({ error: 'Failed to create template' });
      console.error('Error creating template:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateTemplate: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const response = await templateApi.updateTemplate(id, data);
      set((state) => ({
        templates: state.templates.map((template) =>
          template._id === id ? response.data : template
        ),
        selectedTemplate:
          state.selectedTemplate?._id === id
            ? response.data
            : state.selectedTemplate,
      }));
    } catch (error) {
      set({ error: 'Failed to update template' });
      console.error('Error updating template:', error);
    } finally {
      set({ loading: false });
    }
  },

  deleteTemplate: async (id) => {
    try {
      set({ loading: true, error: null });
      await templateApi.deleteTemplate(id);
      set((state) => ({
        templates: state.templates.filter(
          (template) => template._id !== id
        ),
        selectedTemplate:
          state.selectedTemplate?._id === id
            ? null
            : state.selectedTemplate,
      }));
    } catch (error) {
      set({ error: 'Failed to delete template' });
      console.error('Error deleting template:', error);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
  },
}));

export default useTemplateStore; 