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

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imagesPerPage = 5;

  useEffect(() => {
    fetchImages(page);
    fetchOrders();
  }, [page]);

  const fetchImages = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ImageResponse>("/api/images", {
        params: {
          page: currentPage,
          limit: imagesPerPage,
        },
      });
      setImages(response.data.images);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setAlert({ message: "Failed to fetch images", type: "error" });
    } finally {
      setIsLoading(false);
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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    setSelectedImage("");
  };

  const getListItems = () => {
    const items = [...images];
    while (items.length < imagesPerPage) {
      items.push({ catalogId: `placeholder-${items.length}`, geometry: null });
    }
    return items;
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
              <Paper
                sx={{
                  height: 200,
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <List
                    sx={{
                      flex: 1,
                      overflow: "auto",
                      "& .MuiListItem-root": {
                        opacity: (theme) =>
                          theme.palette.mode === "light" ? 1 : 0.7,
                      },
                      "& .placeholder": {
                        visibility: "hidden",
                      },
                    }}
                  >
                    {getListItems().map((image) => (
                      <ListItem
                        key={image.catalogId}
                        disablePadding
                        className={
                          image.catalogId.startsWith("placeholder-")
                            ? "placeholder"
                            : ""
                        }
                      >
                        <ListItemButton
                          selected={selectedImage === image.catalogId}
                          onClick={() => setSelectedImage(image.catalogId)}
                          disabled={image.catalogId.startsWith("placeholder-")}
                        >
                          <Typography>{image.catalogId}</Typography>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  disabled={isLoading}
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
              disabled={!selectedImage || !price || isLoading}
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
            <Paper sx={{ height: 400, overflow: "auto" }}>
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
