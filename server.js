const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello from Node.js server!');
    console.log("서버 응답 성공");
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
