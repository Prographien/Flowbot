import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  content?: string;
  settings?: Record<string, any>;
}

const CustomNode = ({
  data,
  isConnectable,
  type = 'default',
}: NodeProps<CustomNodeData>) => {
  const getNodeStyle = () => {
    switch (type) {
      case 'start':
        return { background: '#6ede87', color: 'white' };
      case 'message':
        return { background: '#ff9966', color: 'white' };
      case 'ai':
        return { background: '#6495ed', color: 'white' };
      case 'condition':
        return { background: '#ba55d3', color: 'white' };
      case 'end':
        return { background: '#ff6b6b', color: 'white' };
      default:
        return { background: '#eee', color: 'black' };
    }
  };

  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '5px',
        minWidth: '150px',
        ...getNodeStyle(),
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div style={{ textAlign: 'center' }}>
        <strong>{data.label}</strong>
        {data.content && (
          <div style={{ fontSize: '0.8em', marginTop: '5px' }}>
            {data.content}
          </div>
        )}
        {data.settings && (
          <div style={{ fontSize: '0.7em', marginTop: '5px', opacity: 0.8 }}>
            {Object.entries(data.settings).map(([key, value]) => (
              <div key={key}>
                {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
              </div>
            ))}
          </div>
        )}
      </div>

      {type !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      )}
      
      {type === 'condition' && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="false"
            style={{ left: -8, background: '#ff6b6b' }}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ right: -8, background: '#6ede87' }}
            isConnectable={isConnectable}
          />
        </>
      )}
    </div>
  );
};

export default memo(CustomNode); 