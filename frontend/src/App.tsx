import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";

interface Image {
  catalogId: string;
  geometry: any;
}

interface Order {
  orderId: string;
  imageId: string;
  price: string;
  createdAt: string;
}

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchImages();
    fetchOrders();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("/api/images");
      setImages(response.data);
    } catch (error) {
      setAlert({ message: "Failed to fetch images", type: "error" });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      setAlert({ message: "Failed to fetch orders", type: "error" });
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedImage || !price) {
      setAlert({
        message: "Please select an image and enter a price",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post("/api/orders", {
        imageId: selectedImage,
        price,
      });
      setOrders([...orders, response.data]);
      setAlert({ message: "Order created successfully", type: "success" });
      setSelectedImage("");
      setPrice("");
    } catch (error) {
      setAlert({ message: "Failed to create order", type: "error" });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Satellite Image Ordering System
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 4 }}
      >
        {/* Order Creation Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create New Order
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Available Images:
              </Typography>
              <Paper sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}>
                <List>
                  {images.map((image) => (
                    <ListItem
                      key={image.catalogId}
                      button
                      selected={selectedImage === image.catalogId}
                      onClick={() => setSelectedImage(image.catalogId)}
                    >
                      <Typography>{image.catalogId}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateOrder}
              disabled={!selectedImage || !price}
            >
              Create Order
            </Button>
          </CardContent>
        </Card>

        {/* Orders List Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
              <List>
                {orders.map((order) => (
                  <ListItem
                    key={order.orderId}
                    sx={{ flexDirection: "column", alignItems: "flex-start" }}
                  >
                    <Typography variant="subtitle1">
                      Order ID: {order.orderId}
                    </Typography>
                    <Typography>Image ID: {order.imageId}</Typography>
                    <Typography>Price: ${order.price}</Typography>
                    <Typography>
                      Created: {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(null)}
      >
        {alert && (
          <Alert severity={alert.type} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}

export default App;
