import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import axios from 'axios';

function DeliverySection() {
  const [formData, setFormData] = useState({
    orderId: '',
    address: ''
  });
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/shipments', formData);
      setDeliveryResult(response.data);
      showSnackbar('Livraison créée avec succès', 'success');
    } catch (error) {
      console.error('Erreur de livraison:', error);
      showSnackbar('Erreur lors de la création de la livraison: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nouvelle Livraison
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="ID de commande"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Adresse de livraison"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Créer la livraison
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {deliveryResult && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Détails de la Livraison
                </Typography>
                <Typography>
                  <strong>Status:</strong> {deliveryResult.status}
                </Typography>
                <Typography>
                  <strong>ID de suivi:</strong> {deliveryResult.trackingId}
                </Typography>
                <Typography>
                  <strong>ID de commande:</strong> {formData.orderId}
                </Typography>
                <Typography>
                  <strong>Adresse:</strong> {formData.address}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DeliverySection; 