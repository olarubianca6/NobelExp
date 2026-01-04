def normalize_mail(value: str) -> str:
    return (value or "").strip().lower()
