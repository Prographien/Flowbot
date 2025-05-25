import { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { flowApi } from '../services/api';

interface UseFlowProps {
  flowId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

interface UseFlowReturn {
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
  saveFlow: () => Promise<void>;
  updateNode: (nodeId: string, data: any) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  updateEdge: (oldEdge: Edge, newConnection: any) => void;
  addEdge: (params: any) => void;
  removeEdge: (edge: Edge) => void;
}

export const useFlow = ({
  flowId,
  initialNodes = [],
  initialEdges = [],
}: UseFlowProps): UseFlowReturn => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load flow data if flowId is provided
  useEffect(() => {
    if (!flowId) return;

    const loadFlow = async () => {
      try {
        setLoading(true);
        const response = await flowApi.getFlow(flowId);
        const { nodes: loadedNodes, edges: loadedEdges } = response.data;
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        setError(null);
      } catch (err) {
        setError('Failed to load flow');
        console.error('Error loading flow:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlow();
  }, [flowId]);

  // Save flow
  const saveFlow = useCallback(async () => {
    if (!flowId) return;

    try {
      setLoading(true);
      await flowApi.updateFlow(flowId, { nodes, edges });
      setError(null);
    } catch (err) {
      setError('Failed to save flow');
      console.error('Error saving flow:', err);
    } finally {
      setLoading(false);
    }
  }, [flowId, nodes, edges]);

  // Node operations
  const updateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, []);

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type,
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        content: '',
        settings: type === 'ai' ? {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
        } : {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }, []);

  // Edge operations
  const updateEdge = useCallback((oldEdge: Edge, newConnection: any) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === oldEdge.id
          ? { ...edge, source: newConnection.source, target: newConnection.target }
          : edge
      )
    );
  }, []);

  const addEdge = useCallback((params: any) => {
    const newEdge: Edge = {
      id: `edge_${Date.now()}`,
      ...params,
    };
    setEdges((eds) => [...eds, newEdge]);
  }, []);

  const removeEdge = useCallback((edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  return {
    nodes,
    edges,
    loading,
    error,
    saveFlow,
    updateNode,
    addNode,
    removeNode,
    updateEdge,
    addEdge,
    removeEdge,
  };
}; 