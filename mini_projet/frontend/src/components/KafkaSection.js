import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';

function KafkaSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simuler la réception d'événements Kafka
    const eventTypes = ['PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'SHIPMENT_CREATED', 'SHIPMENT_DELIVERED'];
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        timestamp: new Date().toISOString(),
        data: {
          orderId: Math.floor(Math.random() * 1000),
          amount: Math.floor(Math.random() * 1000),
          status: Math.random() > 0.5 ? 'SUCCESS' : 'FAILED'
        }
      };
      setEvents(prevEvents => [newEvent, ...prevEvents].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getEventColor = (type) => {
    switch (type) {
      case 'PAYMENT_SUCCESS':
      case 'SHIPMENT_DELIVERED':
        return 'success.main';
      case 'PAYMENT_FAILED':
        return 'error.main';
      default:
        return 'info.main';
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Événements Kafka en temps réel
          </Typography>
          <Paper elevation={0} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {events.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ color: getEventColor(event.type) }}
                        >
                          {event.type}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            Order ID: {event.data.orderId}
                            {event.data.amount && ` | Amount: ${event.data.amount}`}
                            {event.data.status && ` | Status: ${event.data.status}`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < events.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}

export default KafkaSection; 