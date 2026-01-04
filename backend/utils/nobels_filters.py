def build_category_filter(category: str | None) -> str:
    if category and category != "all":
        return f"?prize nobel:category <{category}> ."
    return ""


def build_year_filters(year_from: str | None, year_to: str | None) -> str:
    filters = []
    if year_from and year_from.isdigit():
        filters.append(f"FILTER(xsd:integer(?year) >= {int(year_from)})")
    if year_to and year_to.isdigit():
        filters.append(f"FILTER(xsd:integer(?year) <= {int(year_to)})")
    return "\n".join(filters)
