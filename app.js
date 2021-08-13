const http = require("http");
const fs = require("fs");
const express = require("express");
const service = require("./dbservices.js");
const { response } = require("express");
const app = express();

app.listen(3000);
console.log("Listening on 3000");
app.use("/assets", express.static(__dirname + "/images"));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/api/pageurl", (req, res) => {
  res.send("Done");
});

app.get("/api/getAllSavedPages", async (req, res) => {
  result = await service.getAllSavedPages();
  res.send(result);
});

app.post("/api/saveUrl", async (req, res) => {
  console.log(req.body.encodedURL);
  let result = await service.savePageUrl(req.body.encodedURL);
  res.send(result);
});

app.get("/api/pageurlcount/:pageid", async (req, res) => {
  console.log(req.params.pageid);
  let result = await service.getSavedPageCountById(req.params.pageid);
  console.log(result);
  res.send(result);
});
