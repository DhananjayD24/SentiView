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
from utils.platform import identify_platform
from adapters.amazon import fetch_amazon_reviews
import re
from typing import List, Dict


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

def clean_pasted_reviews(text: str) -> str:
    lines = text.splitlines()
    clean_lines = []

    junk_patterns = [
        r"verified purchase",
        r"reviewed in",
        r"\d+\s+people found this helpful",
        r"helpful",
        r"customer images",
        r"read more",
        r"\bstar\b",
        r"★★★★★",
        r"★★★★",
        r"★★★",
        r"★★",
        r"★"
    ]

    for line in lines:
        line = line.strip()

        # Skip empty lines
        if not line:
            continue

        lower = line.lower()

        # Remove junk pattern lines
        if any(re.search(pattern, lower) for pattern in junk_patterns):
            continue

        # Remove lines that are too short (names, buttons)
        if len(line) < 15:
            continue

        clean_lines.append(line)

    return " ".join(clean_lines)

def extract_star_reviews(text: str):
    """
    Extract reviews based on star rating blocks.
    Works with Amazon / Flipkart pasted reviews.
    """
    reviews = []

    # Split text whenever a star line starts
    blocks = re.split(r"\n(?=[1-5]\.0 out of 5 stars)", text)

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        # Extract star rating
        star_match = re.search(r"([1-5])\.0 out of 5 stars", block)
        if not star_match:
            continue

        stars = int(star_match.group(1))

        # Remove star line + metadata, keep review text
        cleaned = clean_pasted_reviews(block)

        if not cleaned:
            continue

        if stars <= 2:
            sentiment = "negative"
        elif stars == 3:
            sentiment = "neutral"
        else:
            sentiment = "positive"

        reviews.append({
            "text": cleaned,
            "sentiment": sentiment
        })

    return reviews

# -------------------------
# API Endpoint
# -------------------------
@app.post("/analyze")
def analyze_text(data: dict):
    text = data.get("text")
    product_url = data.get("productUrl")
    
# Input validation
    if not text and not product_url:
        return {"error": "Either text or productUrl is required"}

    if text and product_url:
        return {"error": "Provide only one input: text OR productUrl"}

    if text:
        if not text.strip():
            return {"error": "Text is empty"}

        if len(text) > 5000:
            return {"error": "Text too long"}
        
    platform = None

    if product_url:
        platform = identify_platform(product_url)

        if platform == "amazon":
            try:
                reviews = fetch_amazon_reviews(product_url)
            except Exception as e:
                return {"error": str(e)}
    
            if not reviews:
                return {
                    "error": "Amazon blocked automated review access",
                    "fallback": "Please paste reviews manually for analysis",
                    "platform": "amazon"
                }
    
            # Combine reviews into text for existing pipeline
            text = ". ".join(reviews)

        else:
            return {"error": f"Platform '{platform}' not supported yet"}

    results: list = []
    # ⭐ FIRST: try star-based extraction on RAW text
    star_reviews = extract_star_reviews(text)

    if star_reviews:
        # STAR-DRIVEN MODE
        for review in star_reviews:
            sentence = review["text"]          # already cleaned inside extractor
            sentiment = review["sentiment"]

            aspects = detect_aspects(sentence)

            results.append({
                "sentence": sentence,
                "sentiment": sentiment,
                "confidence": 1.0,
                "aspects": aspects
            })

    else:
        # 🧹 CLEAN ONLY IF NO STARS FOUND
        cleaned_text = clean_pasted_reviews(text)

        sentences = nltk.sent_tokenize(cleaned_text)

        for sentence in sentences:
            prediction = sentiment_pipeline(sentence)[0]
            label = prediction["label"]
            confidence = prediction["score"]

            lower_sentence = sentence.lower()

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
