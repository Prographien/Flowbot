import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import FlowBuilder from '../components/FlowBuilder';
import ChatPreview from '../components/ChatPreview';
import useFlowStore from '../store/flowStore';
import useTemplateStore from '../store/templateStore';

const FlowBuilderPage: React.FC = () => {
  const {
    flows,
    selectedFlow,
    loading,
    error,
    fetchFlows,
    createFlow,
    updateFlow,
    setSelectedFlow,
  } = useFlowStore();

  const { templates, fetchTemplates } = useTemplateStore();

  const [isNewFlowDialogOpen, setIsNewFlowDialogOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    fetchFlows();
    fetchTemplates();
  }, [fetchFlows, fetchTemplates]);

  const handleCreateFlow = async () => {
    try {
      await createFlow({
        name: newFlowName,
        nodes: [],
        edges: [],
      });
      setIsNewFlowDialogOpen(false);
      setNewFlowName('');
      setNotification({
        message: 'Flow created successfully',
        type: 'success',
      });
    } catch (error) {
      setNotification({
        message: 'Failed to create flow',
        type: 'error',
      });
    }
  };

  const handleSaveFlow = async (nodes: any[], edges: any[]) => {
    if (!selectedFlow) return;

    try {
      await updateFlow(selectedFlow._id, {
        ...selectedFlow,
        nodes,
        edges,
      });
      setNotification({
        message: 'Flow saved successfully',
        type: 'success',
      });
    } catch (error) {
      setNotification({
        message: 'Failed to save flow',
        type: 'error',
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4">Flow Builder</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setIsNewFlowDialogOpen(true)}
              >
                New Flow
              </Button>
              {selectedFlow && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleSaveFlow(selectedFlow.nodes, selectedFlow.edges)
                    }
                  >
                    Save Flow
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={showPreview ? 8 : 12}>
          <Paper
            sx={{
              height: 'calc(100vh - 200px)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {selectedFlow ? (
              <FlowBuilder
                initialNodes={selectedFlow.nodes}
                initialEdges={selectedFlow.edges}
                onSave={handleSaveFlow}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Select or create a flow to start building
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {showPreview && selectedFlow && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
              <Typography variant="h6" gutterBottom>
                Chat Preview
              </Typography>
              <ChatPreview flowId={selectedFlow._id} />
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* New Flow Dialog */}
      <Dialog
        open={isNewFlowDialogOpen}
        onClose={() => setIsNewFlowDialogOpen(false)}
      >
        <DialogTitle>Create New Flow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Flow Name"
            fullWidth
            value={newFlowName}
            onChange={(e) => setNewFlowName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewFlowDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateFlow}
            variant="contained"
            disabled={!newFlowName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.type}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FlowBuilderPage; 