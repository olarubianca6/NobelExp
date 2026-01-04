from sparql import run_sparql_strict
from utils.nobels_filters import build_category_filter, build_year_filters


def fetch_nobel_prizes(limit: int, offset: int, category: str | None):
    cat_filter = build_category_filter(category)

    subquery = f"""
PREFIX nobel: <http://data.nobelprize.org/terms/>
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?prize
WHERE {{
  ?prize a nobel:NobelPrize ;
         nobel:year ?year .
  {cat_filter}
}}
ORDER BY DESC(xsd:integer(?year))
LIMIT {limit}
OFFSET {offset}
"""
    prize_rows, sub_meta = run_sparql_strict(subquery)
    if not prize_rows:
        return [], {"limit": limit, "offset": offset, "count": 0}

    prize_uris = [f"<{r['prize']['value']}>" for r in prize_rows]
    values_block = " ".join(prize_uris)

    full_query = f"""
PREFIX nobel: <http://data.nobelprize.org/terms/>
PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

SELECT ?prize ?year ?category ?laureate ?laureateName
WHERE {{
  VALUES ?prize {{ {values_block} }}
  ?prize a nobel:NobelPrize ;
         nobel:year ?year ;
         nobel:category ?category ;
         nobel:laureate ?laureate .
  ?laureate foaf:name ?laureateName .
}}
ORDER BY DESC(xsd:integer(?year))
"""
    rows, full_meta = run_sparql_strict(full_query)

    prizes: dict[str, dict] = {}
    for r in rows:
        prize_uri = r["prize"]["value"]
        if prize_uri not in prizes:
            prizes[prize_uri] = {
                "id": prize_uri,
                "year": r["year"]["value"],
                "category": r["category"]["value"],
                "laureates": set(),  # (uri, name)
            }

        laureate_uri = r["laureate"]["value"]
        laureate_name = r["laureateName"]["value"]
        prizes[prize_uri]["laureates"].add((laureate_uri, laureate_name))

    result = [
        {
            "id": p["id"],
            "year": p["year"],
            "category": p["category"],
            "laureates": [
                {"id": lid, "name": lname}
                for lid, lname in sorted(p["laureates"], key=lambda x: x[1])
            ],
        }
        for p in prizes.values()
    ]

    return result, {"limit": limit, "offset": offset, "count": len(result)}


def count_nobel_prizes(category: str | None) -> int:
    cat_filter = build_category_filter(category)

    query = f"""
PREFIX nobel: <http://data.nobelprize.org/terms/>
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

SELECT (COUNT(DISTINCT ?prize) AS ?total)
WHERE {{
  ?prize a nobel:NobelPrize ;
         nobel:year ?year .
  {cat_filter}
}}
"""
    rows, meta = run_sparql_strict(query)
    return int(rows[0]["total"]["value"]) if rows else 0


def fetch_nobel_statistics(category: str | None, year_from: str | None, year_to: str | None):
    cat_filter = build_category_filter(category)
    year_filters = build_year_filters(year_from, year_to)
    filter_str = "\n".join([x for x in [cat_filter, year_filters] if x])

    per_category_query = f"""
PREFIX nobel: <http://data.nobelprize.org/terms/>
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

SELECT ?category
       (COUNT(DISTINCT ?prize) AS ?prizeCount)
       (COUNT(DISTINCT ?laureate) AS ?laureateCount)
WHERE {{
  ?prize a nobel:NobelPrize ;
         nobel:category ?category ;
         nobel:year ?year ;
         nobel:laureate ?laureate .
  {filter_str}
}}
GROUP BY ?category
ORDER BY DESC(?prizeCount)
"""

    totals_query = f"""
PREFIX nobel: <http://data.nobelprize.org/terms/>
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

SELECT (COUNT(DISTINCT ?prize) AS ?totalPrizes)
       (COUNT(DISTINCT ?laureate) AS ?totalLaureates)
WHERE {{
  ?prize a nobel:NobelPrize ;
         nobel:year ?year ;
         nobel:laureate ?laureate .
  {filter_str}
}}
"""

    rows, _ = run_sparql_strict(per_category_query)
    totals_rows, _ = run_sparql_strict(totals_query)

    total_prizes = int(totals_rows[0]["totalPrizes"]["value"]) if totals_rows else 0
    total_laureates = int(totals_rows[0]["totalLaureates"]["value"]) if totals_rows else 0

    categories: dict[str, int] = {}
    laureates_per_category: dict[str, int] = {}

    for r in rows or []:
        cat_uri = r["category"]["value"]
        cat_name = cat_uri.split("/")[-1].replace("_", " ")
        categories[cat_name] = int(r["prizeCount"]["value"])
        laureates_per_category[cat_name] = int(r["laureateCount"]["value"])

    return {
        "totalPrizes": total_prizes,
        "totalLaureates": total_laureates,
        "categories": categories,
        "laureatesPerCategory": laureates_per_category,
        "filters": {
            "category": category or "all",
            "yearFrom": year_from,
            "yearTo": year_to,
        },
    }
