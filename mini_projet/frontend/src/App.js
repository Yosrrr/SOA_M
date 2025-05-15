import React, { useState } from 'react';
import { 
  Container, 
  Tabs, 
  Tab, 
  Box, 
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import PerfumeSection from './components/PerfumeSection';
import PaymentSection from './components/PaymentSection';
import DeliverySection from './components/DeliverySection';
import KafkaSection from './components/KafkaSection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Microservices Test Interface
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Parfums (REST/GraphQL)" />
              <Tab label="Paiements (gRPC)" />
              <Tab label="Livraisons (gRPC)" />
              <Tab label="Kafka Events" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <PerfumeSection />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PaymentSection />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DeliverySection />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <KafkaSection />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 