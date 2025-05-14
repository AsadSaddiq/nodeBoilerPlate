import expressLoader from "./express.js";
import { connectDB } from "./postgress.js"; // Import named export

const loader = async (app) => {
  await connectDB(); // Call the connection function directly
  await expressLoader(app);
};

export default loader;
