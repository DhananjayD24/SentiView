def identify_platform(url: str) -> str:
    url = url.lower()

    if "amazon." in url:
        return "amazon"
    if "flipkart." in url:
        return "flipkart"
    if "myntra." in url:
        return "myntra"

    return "generic"
