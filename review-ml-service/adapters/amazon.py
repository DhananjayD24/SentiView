import re
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def extract_asin(url: str) -> str:
    """
    Extract ASIN from Amazon product URL
    """
    match = re.search(r"/dp/([A-Z0-9]{10})", url)
    if match:
        return match.group(1)
    return None

def fetch_amazon_reviews(product_url: str, limit: int = 20) -> list:
    asin = extract_asin(product_url)
    if not asin:
        raise Exception("Unable to extract ASIN from Amazon URL")

    reviews_url = f"https://www.amazon.in/product-reviews/{asin}"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-IN,en;q=0.9",
        "Accept": "text/html",
        "Connection": "keep-alive",
    }

    response = requests.get(reviews_url, headers=headers, timeout=10)

    if response.status_code != 200:
        raise Exception("Failed to fetch Amazon reviews page")

    soup = BeautifulSoup(response.text, "html.parser")

    reviews = []

    # Primary selector
    blocks = soup.select("span[data-hook='review-body']")

    # Fallback selector (Amazon sometimes changes markup)
    if not blocks:
        blocks = soup.select("div[data-hook='review'] span")

    for block in blocks:
        text = block.get_text(strip=True)
        if text and len(text) > 20:  # avoid junk
            reviews.append(text)

        if len(reviews) >= limit:
            break

    return reviews
