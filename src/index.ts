import express from "express";
import imageRoutes from "./routes/imageRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", imageRoutes);
app.use("/api", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
