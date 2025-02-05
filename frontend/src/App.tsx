/**
 * ==========================================
 * Image Processing Frontend
 * ==========================================
 *
 * A React-based frontend for the image processing service.
 *
 * Technical Stack:
 * - React 18 with TypeScript
 * - Vite for build tooling
 * - Material-UI (MUI) for component library
 * - Axios for HTTP requests
 *
 * Development tools:
 * - Code structure: Created by Claude (Anthropic) & edited by the auhthor.
 */

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
  Popover,
} from "@mui/material";
import axios from "axios";

interface Image {
  catalogId: string;
  geometry: any;
  createdAt: string;
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
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Images state
  const [images, setImages] = useState<Image[]>([]);
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotalPages, setImagesTotalPages] = useState(1);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Popover state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedImageDetails, setSelectedImageDetails] =
    useState<Image | null>(null);

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
      const response = await axios.get<ImageResponse>(`${API_URL}/api/images`, {
        params: {
          page: currentPage,
          limit: imagesPerPage,
          t: Date.now(),
        },
      });

      const responseData = response.data;
      if (responseData?.images) {
        setImages(responseData.images);
        setImagesTotalPages(Math.max(1, responseData.totalPages || 1));
      } else {
        setImages([]);
        setImagesTotalPages(1);
      }
    } catch (error) {
      console.error("Error:", error);
      setImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const fetchOrders = async (currentPage: number) => {
    setIsLoadingOrders(true);
    try {
      const response = await axios.get<OrderResponse>(`${API_URL}/api/orders`, {
        params: {
          page: currentPage,
          limit: ordersPerPage,
          t: Date.now(),
        },
      });

      const responseData = response.data;
      if (responseData?.orders) {
        setOrders(responseData.orders);
        setOrdersTotalPages(Math.max(1, responseData.totalPages || 1));
      } else {
        setOrders([]);
        setOrdersTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setAlert({ message: "Failed to fetch orders", type: "error" });
      setOrders([]);
      setOrdersTotalPages(1);
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
      const response = await axios.post<Order>(`${API_URL}/api/orders`, {
        imageId: selectedImage,
        price: Number(price),
      });

      if (response.status === 201) {
        setOrdersPage(1);
        await fetchOrders(1);
        setAlert({ message: "Order created successfully", type: "success" });
        setSelectedImage("");
        setPrice("");
      } else {
        setAlert({ message: "Unexpected response from server", type: "error" });
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create order";
      setAlert({ message: errorMessage, type: "error" });
    }
  };

  const handleImageClick = (
    event: React.MouseEvent<HTMLElement>,
    image: Image
  ) => {
    setSelectedImage(image.catalogId);
    setSelectedImageDetails(image);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedImageDetails(null);
  };

  const handleImagesPageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setImagesPage(value);
    setSelectedImage("");
    handlePopoverClose();
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
              <Paper sx={{ height: 200, overflow: "auto", mb: 2 }}>
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
                          onClick={(event) => handleImageClick(event, image)}
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

      {/* Image Details Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              boxShadow: 1,
            },
          },
        }}
        transitionDuration={{
          enter: 100,
          exit: 75,
        }}
      >
        {selectedImageDetails && (
          <Box sx={{ p: 3, width: 500 }}>
            <Typography variant="h6" gutterBottom>
              Image Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Catalog ID:</strong> {selectedImageDetails.catalogId}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Created At:</strong>{" "}
              {new Date(selectedImageDetails.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Coverage Area:</strong>
              <Box
                component="pre"
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  overflow: "auto",
                  maxHeight: 200,
                  fontSize: "0.875rem",
                }}
              >
                {JSON.stringify(selectedImageDetails.geometry, null, 2)}
              </Box>
            </Typography>
          </Box>
        )}
      </Popover>

      {/* Alert Snackbar */}
      {alert && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setAlert(null)}
        >
          <Alert severity={alert.type} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default App;
