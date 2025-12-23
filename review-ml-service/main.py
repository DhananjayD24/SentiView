# from fastapi import FastAPI
# from transformers import pipeline
# import nltk

# # Download required NLTK data
# nltk.download("punkt")
# nltk.download("punkt_tab")

# app = FastAPI()

# # 1️⃣ LOAD MODEL (ONLY THIS HERE)
# sentiment_pipeline = pipeline(
#     "sentiment-analysis",
#     model="distilbert-base-uncased-finetuned-sst-2-english"
# )

# # 2️⃣ DEFINE WEAK-POSITIVE WORDS (GLOBAL)
# NEUTRAL_WORDS = [
#     "okay", "fine", "average", "decent", "not bad",
#     "satisfactory", "usable", "works", "normal"
# ]

# ASPECT_KEYWORDS = {
#     "camera": ["camera", "photo", "picture", "video", "selfie"],
#     "battery": ["battery", "drain", "charge", "charging", "backup", "power"],
#     "performance": ["performance", "speed", "fast", "slow", "lag", "smooth"],
#     "quality": ["quality", "build", "material", "durable", "sturdy"],
#     "usability": ["easy", "use", "usable", "user friendly", "comfortable"],
#     "price": ["price", "cost", "expensive", "cheap", "value", "worth"],
#     "delivery": ["delivery", "shipping", "package", "packing", "late"],
#     "support": ["support", "service", "warranty", "refund", "replacement"]
# }


# def detect_aspects(sentence: str) -> list:
#     lower_sentence = sentence.lower()
#     matched_aspects = []

#     for aspect, keywords in ASPECT_KEYWORDS.items():
#         for keyword in keywords:
#             if keyword in lower_sentence:
#                 matched_aspects.append(aspect)
#                 break

#     if not matched_aspects:
#         matched_aspects.append("general")

#     return matched_aspects

# def aggregate_aspects(results: list) -> dict:
#     aspect_summary = {}

#     for item in results:
#         sentiment = item.get("sentiment")

#         # ✅ SAFE access (fixes your error)
#         aspects = item.get("aspects", ["general"])

#         for aspect in aspects:
#             if aspect not in aspect_summary:
#                 aspect_summary[aspect] = {
#                     "good": 0,
#                     "average": 0,
#                     "bad": 0
#                 }

#             if sentiment == "positive":
#                 aspect_summary[aspect]["good"] += 1
#             elif sentiment == "neutral":
#                 aspect_summary[aspect]["average"] += 1
#             elif sentiment == "negative":
#                 aspect_summary[aspect]["bad"] += 1

#     return aspect_summary

# def generate_insights(aspect_summary: dict):
#     reasons_to_buy = []
#     reasons_to_avoid = []
#     mixed_aspects = []

#     for aspect, counts in aspect_summary.items():
#         good = counts["good"]
#         avg = counts["average"]
#         bad = counts["bad"]

#         if good > bad and good >= avg:
#             reasons_to_buy.append(aspect)
#         elif bad > good and bad >= avg:
#             reasons_to_avoid.append(aspect)
#         else:
#             mixed_aspects.append(aspect)

#     return reasons_to_buy, reasons_to_avoid, mixed_aspects


# @app.post("/analyze")
# def analyze_text(data: dict):
#     text = data.get("text", "")

#     if not text or not text.strip():
#         return {"error": "Text is empty"}

#     if len(text) > 5000:
#         return {"error": "Text too long"}

#     sentences = nltk.sent_tokenize(text)
#     results = []

#     for sentence in sentences:
#         prediction = sentiment_pipeline(sentence)[0]

#         label = prediction["label"]
#         confidence = prediction["score"]

#         lower_sentence = sentence.lower()

#         # 3️⃣ PRODUCT LOGIC (HERE ONLY)
#         if any(word in lower_sentence for word in NEUTRAL_WORDS):
#             sentiment = "neutral"
#         elif confidence < 0.6:
#             sentiment = "neutral"
#         else:
#             sentiment = "positive" if label == "POSITIVE" else "negative"
        
#         aspects = detect_aspects(sentence)
#         results.append({
#             "sentence": sentence,
#             "sentiment": sentiment,
#             "confidence": round(confidence, 2),
#             "aspects": aspects
#         })
    
#     aspect_summary = aggregate_aspects(results)
#     reasons_to_buy, reasons_to_avoid, mixed_aspects = generate_insights(aspect_summary)

#     return {
#         "totalSentences": len(results),
#         "results": results,
#         "aspectSummary": aspect_summary,
#         "insights": {
#             "reasonsToBuy": reasons_to_buy,
#             "reasonsToAvoid": reasons_to_avoid,
#             "mixedAspects": mixed_aspects
#         }
#     }


from fastapi import FastAPI
from transformers import pipeline
import nltk

# -------------------------
# NLTK setup (quiet & safe)
# -------------------------
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)

app = FastAPI()

# -------------------------
# Load HuggingFace model
# -------------------------
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

# -------------------------
# Weak-positive words → neutral
# -------------------------
NEUTRAL_WORDS = [
    "okay", "fine", "average", "decent", "not bad",
    "satisfactory", "usable", "works", "normal"
]

# -------------------------
# Aspect keywords (generic)
# -------------------------
ASPECT_KEYWORDS = {
    "camera": ["camera", "photo", "picture", "video", "selfie"],
    "battery": ["battery", "drain", "charge", "charging", "backup", "power"],
    "performance": ["performance", "speed", "fast", "slow", "lag", "smooth"],
    "quality": ["quality", "build", "material", "durable", "sturdy"],
    "usability": ["easy", "use", "usable", "user friendly", "comfortable"],
    "price": ["price", "cost", "expensive", "cheap", "value", "worth"],
    "delivery": ["delivery", "shipping", "package", "packing", "late"],
    "support": ["support", "service", "warranty", "refund", "replacement"]
}

# -------------------------
# Detect multiple aspects
# -------------------------
def detect_aspects(sentence: str) -> list:
    lower_sentence = sentence.lower()
    words = lower_sentence.split()
    matched_aspects = []

    for aspect, keywords in ASPECT_KEYWORDS.items():
        for keyword in keywords:
            if keyword in words or keyword in lower_sentence:
                matched_aspects.append(aspect)
                break

    if not matched_aspects:
        matched_aspects.append("general")

    return matched_aspects

# -------------------------
# Aggregate aspects
# -------------------------
def aggregate_aspects(results: list) -> dict:
    aspect_summary = {}

    for item in results:
        sentiment = item.get("sentiment")
        aspects = item.get("aspects", ["general"])

        for aspect in aspects:
            if aspect not in aspect_summary:
                aspect_summary[aspect] = {
                    "good": 0,
                    "average": 0,
                    "bad": 0
                }

            if sentiment == "positive":
                aspect_summary[aspect]["good"] += 1
            elif sentiment == "neutral":
                aspect_summary[aspect]["average"] += 1
            elif sentiment == "negative":
                aspect_summary[aspect]["bad"] += 1

    return aspect_summary

# -------------------------
# Generate insights
# -------------------------
def generate_insights(aspect_summary: dict):
    reasons_to_buy = []
    reasons_to_avoid = []
    mixed_aspects = []

    for aspect, counts in aspect_summary.items():
        if aspect == "general":
            continue  # skip useless aspect

        good = counts["good"]
        avg = counts["average"]
        bad = counts["bad"]

        if good > bad and good >= avg:
            reasons_to_buy.append(aspect)
        elif bad > good and bad >= avg:
            reasons_to_avoid.append(aspect)
        else:
            mixed_aspects.append(aspect)

    return reasons_to_buy, reasons_to_avoid, mixed_aspects

def calculate_severity(aspect_summary: dict) -> dict:
    severity_map = {}

    for aspect, counts in aspect_summary.items():
        good = counts["good"]
        avg = counts["average"]
        bad = counts["bad"]
        total = good + avg + bad

        if total == 0:
            continue

        bad_percentage = (bad / total) * 100
        good_percentage = (good / total) * 100

        if bad_percentage >= 60:
            severity = "major"
        elif bad_percentage >= 30:
            severity = "moderate"
        elif good_percentage >= 60:
            severity = "strong_positive"
        else:
            severity = "mixed"

        severity_map[aspect] = {
            **counts,
            "total": total,
            "badPercentage": round(bad_percentage, 1),
            "goodPercentage": round(good_percentage, 1),
            "severity": severity
        }

    return severity_map


# -------------------------
# API Endpoint
# -------------------------
@app.post("/analyze")
def analyze_text(data: dict):
    text = data.get("text", "")

    if not text or not text.strip():
        return {"error": "Text is empty"}

    if len(text) > 5000:
        return {"error": "Text too long"}

    sentences = nltk.sent_tokenize(text)
    results = []

    for sentence in sentences:
        prediction = sentiment_pipeline(sentence)[0]
        label = prediction["label"]
        confidence = prediction["score"]

        lower_sentence = sentence.lower()

        # Hybrid sentiment logic
        if any(word in lower_sentence for word in NEUTRAL_WORDS):
            sentiment = "neutral"
        elif confidence < 0.6:
            sentiment = "neutral"
        else:
            sentiment = "positive" if label == "POSITIVE" else "negative"

        aspects = detect_aspects(sentence)

        results.append({
            "sentence": sentence,
            "sentiment": sentiment,
            "confidence": round(confidence, 2),
            "aspects": aspects
        })

    # Aggregation & insights
    aspect_summary = aggregate_aspects(results)
    reasons_to_buy, reasons_to_avoid, mixed_aspects = generate_insights(aspect_summary)
    severityAnalysis = calculate_severity(aspect_summary)


    # Summary counts (frontend-ready)
    summary_counts = {
        "total": len(results),
        "positive": sum(1 for r in results if r["sentiment"] == "positive"),
        "neutral": sum(1 for r in results if r["sentiment"] == "neutral"),
        "negative": sum(1 for r in results if r["sentiment"] == "negative")
    }

    return {
        "totalSentences": len(results),
        "summaryCounts": summary_counts,
        "results": results,
        "aspectSummary": aspect_summary,
        "severityAnalysis": severityAnalysis,
        "insights": {
            "reasonsToBuy": reasons_to_buy,
            "reasonsToAvoid": reasons_to_avoid,
            "mixedAspects": mixed_aspects
        }
    }
