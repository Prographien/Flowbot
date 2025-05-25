import create from 'zustand';
import { Node, Edge } from 'reactflow';
import { flowApi } from '../services/api';

interface FlowState {
  flows: any[];
  selectedFlow: any | null;
  loading: boolean;
  error: string | null;
  fetchFlows: () => Promise<void>;
  createFlow: (data: any) => Promise<void>;
  updateFlow: (id: string, data: any) => Promise<void>;
  deleteFlow: (id: string) => Promise<void>;
  setSelectedFlow: (flow: any) => void;
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (edges: Edge[]) => void;
}

const useFlowStore = create<FlowState>((set, get) => ({
  flows: [],
  selectedFlow: null,
  loading: false,
  error: null,

  fetchFlows: async () => {
    try {
      set({ loading: true, error: null });
      const response = await flowApi.getFlows();
      set({ flows: response.data });
    } catch (error) {
      set({ error: 'Failed to fetch flows' });
      console.error('Error fetching flows:', error);
    } finally {
      set({ loading: false });
    }
  },

  createFlow: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await flowApi.createFlow(data);
      set((state) => ({
        flows: [...state.flows, response.data],
      }));
    } catch (error) {
      set({ error: 'Failed to create flow' });
      console.error('Error creating flow:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateFlow: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const response = await flowApi.updateFlow(id, data);
      set((state) => ({
        flows: state.flows.map((flow) =>
          flow._id === id ? response.data : flow
        ),
        selectedFlow:
          state.selectedFlow?._id === id ? response.data : state.selectedFlow,
      }));
    } catch (error) {
      set({ error: 'Failed to update flow' });
      console.error('Error updating flow:', error);
    } finally {
      set({ loading: false });
    }
  },

  deleteFlow: async (id) => {
    try {
      set({ loading: true, error: null });
      await flowApi.deleteFlow(id);
      set((state) => ({
        flows: state.flows.filter((flow) => flow._id !== id),
        selectedFlow:
          state.selectedFlow?._id === id ? null : state.selectedFlow,
      }));
    } catch (error) {
      set({ error: 'Failed to delete flow' });
      console.error('Error deleting flow:', error);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedFlow: (flow) => {
    set({ selectedFlow: flow });
  },

  updateNodes: (nodes) => {
    set((state) => ({
      selectedFlow: state.selectedFlow
        ? { ...state.selectedFlow, nodes }
        : null,
    }));
  },

  updateEdges: (edges) => {
    set((state) => ({
      selectedFlow: state.selectedFlow
        ? { ...state.selectedFlow, edges }
        : null,
    }));
  },
}));

export default useFlowStore; 