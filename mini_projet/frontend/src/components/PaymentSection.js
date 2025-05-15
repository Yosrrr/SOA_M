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

function PaymentSection() {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'EUR',
    source: ''
  });
  const [paymentResult, setPaymentResult] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/payments', formData);
      setPaymentResult(response.data);
      showSnackbar('Paiement traité avec succès', 'success');
    } catch (error) {
      console.error('Erreur de paiement:', error);
      showSnackbar('Erreur lors du traitement du paiement: ' + (error.response?.data?.error || error.message), 'error');
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
                Nouveau Paiement
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Montant"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Devise"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Source de paiement"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Effectuer le paiement
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {paymentResult && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Résultat du Paiement
                </Typography>
                <Typography>
                  <strong>Status:</strong> {paymentResult.status}
                </Typography>
                <Typography>
                  <strong>ID de paiement:</strong> {paymentResult.paymentId}
                </Typography>
                <Typography>
                  <strong>Montant:</strong> {paymentResult.amount} {paymentResult.currency}
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

export default PaymentSection; 