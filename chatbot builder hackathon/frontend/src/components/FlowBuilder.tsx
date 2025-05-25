import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import CustomNode from './nodes/CustomNode';
import 'reactflow/dist/style.css';

interface FlowBuilderProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

const nodeTypes = {
  start: CustomNode,
  message: CustomNode,
  ai: CustomNode,
  condition: CustomNode,
  end: CustomNode,
};

const FlowBuilder: React.FC<FlowBuilderProps> = ({
  initialNodes = [],
  initialEdges = [],
  onSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node_${nodes.length + 1}`,
      type,
      position: { x: 250, y: 100 + nodes.length * 100 },
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
  };

  const handleSave = () => {
    onSave?.(nodes, edges);
  };

  const updateNodeData = (key: string, value: any) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, [key]: value } }
          : n
      )
    );
  };

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <div style={{ height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <button onClick={() => addNode('start')}>Add Start</button>
        <button onClick={() => addNode('message')}>Add Message</button>
        <button onClick={() => addNode('ai')}>Add AI</button>
        <button onClick={() => addNode('condition')}>Add Condition</button>
        <button onClick={() => addNode('end')}>Add End</button>
        <button onClick={handleSave}>Save Flow</button>
      </div>
      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            background: 'white',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            width: '300px',
          }}
        >
          <h3>Node Properties</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Label:</label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => updateNodeData('label', e.target.value)}
              style={{ width: '100%', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Content:</label>
            <textarea
              value={selectedNode.data.content}
              onChange={(e) => updateNodeData('content', e.target.value)}
              style={{ width: '100%', marginTop: '5px', minHeight: '100px' }}
            />
          </div>
          {selectedNode.type === 'ai' && (
            <div>
              <h4>AI Settings</h4>
              <div style={{ marginBottom: '10px' }}>
                <label>Model:</label>
                <select
                  value={selectedNode.data.settings?.model}
                  onChange={(e) =>
                    updateNodeData('settings', {
                      ...selectedNode.data.settings,
                      model: e.target.value,
                    })
                  }
                  style={{ width: '100%', marginTop: '5px' }}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Temperature:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedNode.data.settings?.temperature}
                  onChange={(e) =>
                    updateNodeData('settings', {
                      ...selectedNode.data.settings,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  style={{ width: '100%', marginTop: '5px' }}
                />
                <span>{selectedNode.data.settings?.temperature}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowBuilder; 