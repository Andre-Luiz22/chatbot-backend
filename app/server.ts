import { app } from "./src/app";
import "dotenv/config";


const PORT = process.env.PORT;



app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});