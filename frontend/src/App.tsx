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
  ListItemButton,
  Paper,
  Alert,
  Snackbar,
  Pagination,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "axios";

interface Image {
  catalogId: string;
  geometry: any;
}

interface ImageResponse {
  images: Image[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface Order {
  orderId: string;
  imageId: string;
  price: string;
  createdAt: string;
}

interface OrderResponse {
  orders: Order[];
  total: number;
  currentPage: number;
  totalPages: number;
}

function App() {
  // Images state
  const [images, setImages] = useState<Image[]>([]);
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotalPages, setImagesTotalPages] = useState(1);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const imagesPerPage = 5;
  const ordersPerPage = 3;

  useEffect(() => {
    fetchImages(imagesPage);
  }, [imagesPage]);

  useEffect(() => {
    fetchOrders(ordersPage);
  }, [ordersPage]);

  const fetchImages = async (currentPage: number) => {
    setIsLoadingImages(true);
    try {
      const response = await axios.get<ImageResponse>("/api/images", {
        params: {
          page: currentPage,
          limit: imagesPerPage,
        },
      });
      setImages(response.data.images);
      setImagesTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setAlert({ message: "Failed to fetch images", type: "error" });
      setImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const fetchOrders = async (currentPage: number) => {
    setIsLoadingOrders(true);
    try {
      const response = await axios.get<OrderResponse>("/api/orders", {
        params: {
          page: currentPage,
          limit: ordersPerPage,
        },
      });
      setOrders(response.data.orders);
      setOrdersTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setAlert({ message: "Failed to fetch orders", type: "error" });
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
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
      await axios.post<Order>("/api/orders", {
        imageId: selectedImage,
        price,
      });

      setOrdersPage(1);
      await fetchOrders(1);

      setAlert({ message: "Order created successfully", type: "success" });
      setSelectedImage("");
      setPrice("");
    } catch (error) {
      console.error("Error creating order:", error);
      setAlert({ message: "Failed to create order", type: "error" });
    }
  };

  const handleImagesPageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setImagesPage(value);
    setSelectedImage("");
  };

  const handleOrdersPageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setOrdersPage(value);
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
                {isLoadingImages ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : images.length > 0 ? (
                  <List>
                    {images.map((image) => (
                      <ListItem key={image.catalogId} disablePadding>
                        <ListItemButton
                          selected={selectedImage === image.catalogId}
                          onClick={() => setSelectedImage(image.catalogId)}
                        >
                          <Typography>{image.catalogId}</Typography>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No images available
                    </Typography>
                  </Box>
                )}
              </Paper>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={imagesTotalPages}
                  page={imagesPage}
                  onChange={handleImagesPageChange}
                  color="primary"
                  size="small"
                  disabled={isLoadingImages}
                />
              </Box>
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
              disabled={!selectedImage || !price || isLoadingImages}
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
              {isLoadingOrders ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : orders.length > 0 ? (
                <List>
                  {orders.map((order, index) => (
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
                      {index < orders.length - 1 && (
                        <Divider sx={{ width: "100%", my: 1 }} />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No orders available
                  </Typography>
                </Box>
              )}
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={ordersTotalPages}
                page={ordersPage}
                onChange={handleOrdersPageChange}
                color="primary"
                size="small"
                disabled={isLoadingOrders}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {alert ? (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setAlert(null)}
        >
          <Alert severity={alert.type} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </Snackbar>
      ) : null}
    </Container>
  );
}

export default App;
