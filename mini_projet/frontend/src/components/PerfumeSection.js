import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

const GET_PERFUMES = gql`
  query GetPerfumes {
    perfumes {
      id
      name
      brand
      fragranceNotes
    }
  }
`;

function PerfumeSection() {
  const [perfumes, setPerfumes] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    fragranceNotes: ''
  });

  const fetchPerfumes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/perfumes');
      setPerfumes(response.data);
    } catch (error) {
      console.error('Erreur REST:', error);
      showSnackbar('Erreur lors de la récupération des parfums: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const fetchPerfumesGraphQL = async () => {
    try {
      const { data } = await client.query({ query: GET_PERFUMES });
      setPerfumes(data.perfumes);
    } catch (error) {
      console.error('Erreur GraphQL:', error);
      showSnackbar('Erreur lors de la récupération des parfums via GraphQL: ' + error.message, 'error');
    }
  };

  useEffect(() => {
    if (currentTab === 0) {
      fetchPerfumes();
    } else {
      fetchPerfumesGraphQL();
    }
  }, [currentTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/perfumes', formData);
      setOpen(false);
      fetchPerfumes();
      showSnackbar('Parfum ajouté avec succès', 'success');
    } catch (error) {
      console.error('Erreur ajout:', error);
      showSnackbar('Erreur lors de l\'ajout du parfum: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/perfumes/${id}`);
      fetchPerfumes();
      showSnackbar('Parfum supprimé avec succès', 'success');
    } catch (error) {
      console.error('Erreur suppression:', error);
      showSnackbar('Erreur lors de la suppression du parfum: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="REST API" />
          <Tab label="GraphQL" />
        </Tabs>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        Ajouter un parfum
      </Button>

      <Grid container spacing={3}>
        {perfumes.map((perfume) => (
          <Grid item xs={12} sm={6} md={4} key={perfume.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{perfume.name}</Typography>
                <Typography color="textSecondary">{perfume.brand}</Typography>
                <Typography variant="body2">{perfume.fragranceNotes}</Typography>
                <Button
                  color="error"
                  onClick={() => handleDelete(perfume.id)}
                  sx={{ mt: 2 }}
                >
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter un nouveau parfum</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Marque"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Notes de parfum"
              value={formData.fragranceNotes}
              onChange={(e) => setFormData({ ...formData, fragranceNotes: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

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

export default PerfumeSection; 