const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = Number(process.env.PORT || 3030);
const dataDir = path.join(__dirname, "data");
const dealershipsFile = path.join(dataDir, "dealerships.json");
const reviewsFile = path.join(dataDir, "reviews.json");
const carsFile = path.join(dataDir, "car_records.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function readData(file, key) {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(parsed[key]) ? parsed[key] : [];
}
function writeData(file, key, values) {
  fs.writeFileSync(file, JSON.stringify({ [key]: values }, null, 2) + "\n");
}
const normalize = (value) => String(value ?? "").trim().toLowerCase();

app.get("/", (_req, res) => res.send("Cars Dealership data API is running."));
app.get("/fetchDealers", (_req, res) => {
  try { return res.json(readData(dealershipsFile, "dealerships")); }
  catch (error) { return res.status(500).json({ error: "Unable to read dealerships" }); }
});
app.get("/fetchDealers/:state", (req, res) => {
  try {
    const state = normalize(decodeURIComponent(req.params.state));
    const matches = readData(dealershipsFile, "dealerships").filter((d) =>
      normalize(d.state) === state || normalize(d.st) === state
    );
    return res.json(matches);
  } catch (error) { return res.status(500).json({ error: "Unable to filter dealerships" }); }
});
app.get("/fetchDealer/:id", (req, res) => {
  const id = Number(req.params.id);
  const dealer = readData(dealershipsFile, "dealerships").find((d) => Number(d.id) === id);
  if (!dealer) return res.status(404).json({ error: "Dealer not found" });
  return res.json(dealer);
});
app.get("/fetchReviews", (_req, res) => {
  try { return res.json(readData(reviewsFile, "reviews")); }
  catch (error) { return res.status(500).json({ error: "Unable to read reviews" }); }
});
app.get("/fetchReviews/dealer/:id", (req, res) => {
  const id = Number(req.params.id);
  const reviews = readData(reviewsFile, "reviews").filter((review) => Number(review.dealership) === id);
  return res.json(reviews);
});
app.get("/fetchCars", (_req, res) => {
  try { return res.json(readData(carsFile, "cars")); }
  catch (error) { return res.status(500).json({ error: "Unable to read car inventory" }); }
});
app.get("/fetchCarModels", (_req, res) => {
  try {
    const seen = new Set();
    const CarModels = readData(carsFile, "cars").reduce((items, car) => {
      const key = [car.make, car.model].join("\u0000");
      if (car.make && car.model && !seen.has(key)) {
        seen.add(key);
        items.push({ CarMake: car.make, CarModel: car.model });
      }
      return items;
    }, []);
    return res.json({ CarModels });
  } catch (error) { return res.status(500).json({ error: "Unable to read car models" }); }
});
app.post("/insert_review", (req, res) => {
  const body = req.body || {};
  const required = ["name", "dealership", "review", "purchase", "purchase_date", "car_make", "car_model", "car_year"];
  const missing = required.filter((key) => body[key] === undefined || body[key] === null || body[key] === "");
  if (missing.length) return res.status(400).json({ error: "Missing required fields", fields: missing });
  try {
    const reviews = readData(reviewsFile, "reviews");
    const nextId = reviews.reduce((max, review) => Math.max(max, Number(review.id) || 0), 0) + 1;
    const review = {
      id: nextId,
      name: String(body.name),
      dealership: Number(body.dealership),
      review: String(body.review),
      purchase: Boolean(body.purchase),
      purchase_date: String(body.purchase_date),
      car_make: String(body.car_make),
      car_model: String(body.car_model),
      car_year: Number(body.car_year)
    };
    reviews.push(review);
    writeData(reviewsFile, "reviews", reviews);
    return res.status(201).json(review);
  } catch (error) { return res.status(500).json({ error: "Unable to save review" }); }
});

app.listen(port, "0.0.0.0", () => console.log("Cars Dealership data API listening on port " + port));
