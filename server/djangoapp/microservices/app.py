from flask import Flask, jsonify
from urllib.parse import unquote

app = Flask(__name__)

POSITIVE_WORDS = {
    "amazing", "awesome", "best", "excellent", "fantastic", "friendly",
    "good", "great", "helpful", "love", "outstanding", "positive", "recommend",
    "satisfied", "service", "services", "wonderful"
}
NEGATIVE_WORDS = {
    "awful", "bad", "broken", "disappointed", "hate", "horrible", "poor",
    "rude", "terrible", "unhappy", "worst"
}


def classify(text):
    words = [word.strip(".,!?;:()[]{}\"'").lower() for word in text.split()]
    positive = sum(word in POSITIVE_WORDS for word in words)
    negative = sum(word in NEGATIVE_WORDS for word in words)
    if positive > negative:
        return "positive"
    if negative > positive:
        return "negative"
    return "neutral"


@app.get("/")
def home():
    return jsonify({"service": "Cars Dealership Sentiment API", "status": "running"})


@app.get("/analyze/<path:text>")
def analyze(text):
    return jsonify({"sentiment": classify(unquote(text))})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(__import__("os").environ.get("PORT", "5050")))
