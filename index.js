import app from "./src/server.js";
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`SERVER IS Runing on PORT : ${PORT}`);
});
