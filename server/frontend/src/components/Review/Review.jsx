import React, { useState } from "react";

const initialForm = {
  review: "",
  purchase: true,
  purchase_date: "",
  car_make: "",
  car_model: "",
  car_year: ""
};

export default function Review({ dealerId, userName, onSubmitted }) {
  const [form, setForm] = useState(initialForm);
  const [sentiment, setSentiment] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (name === "review") setSentiment("");
  };

  const checkSentiment = async () => {
    if (!form.review.trim()) {
      setMessage("Enter a review before checking sentiment.");
      return;
    }
    try {
      const response = await fetch(`/analyze/${encodeURIComponent(form.review)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sentiment analysis failed.");
      setSentiment(result.sentiment);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Sentiment service is unavailable.");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/djangoapp/add_review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: userName || "Guest",
          dealership: Number(dealerId),
          ...form,
          car_year: Number(form.car_year)
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit review.");
      setMessage("Review submitted successfully.");
      if (typeof onSubmitted === "function") onSubmitted({ ...result, sentiment });
      setForm(initialForm);
      setSentiment("");
    } catch (error) {
      setMessage(error.message || "Could not submit review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="review-form">
      <h2>Post a Review</h2>
      <form onSubmit={submit}>
        <label htmlFor="review-text">Review</label>
        <textarea id="review-text" name="review" value={form.review} onChange={change} required rows="4" />

        <label htmlFor="purchase-date">Purchase date</label>
        <input id="purchase-date" name="purchase_date" type="date" value={form.purchase_date} onChange={change} required />

        <label htmlFor="car-make">Car make</label>
        <input id="car-make" name="car_make" type="text" placeholder="e.g. Toyota" value={form.car_make} onChange={change} required />

        <label htmlFor="car-model">Car model</label>
        <input id="car-model" name="car_model" type="text" placeholder="e.g. Camry" value={form.car_model} onChange={change} required />

        <label htmlFor="car-year">Car year</label>
        <input id="car-year" name="car_year" type="number" min="1900" max="2100" value={form.car_year} onChange={change} required />

        <label className="purchase-check">
          <input name="purchase" type="checkbox" checked={form.purchase} onChange={change} />
          I purchased a vehicle from this dealer
        </label>

        <div className="review-actions">
          <button type="button" onClick={checkSentiment}>Analyze sentiment</button>
          <button type="submit" disabled={busy}>{busy ? "Submitting..." : "Submit Review"}</button>
        </div>

        {sentiment && (
          <p className="sentiment-result">
            <img src={`/static/sentiment_${sentiment}.svg`} alt={`${sentiment} sentiment`} width="32" height="32" style={{ width: 32, height: 32, objectFit: "contain" }} />
            Sentiment: {sentiment}
          </p>
        )}
        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
}
