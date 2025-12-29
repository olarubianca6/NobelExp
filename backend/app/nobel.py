from flask import Blueprint, jsonify, request
from sparql import run_sparql_strict, SparqlError

nobel_bp = Blueprint("nobel", __name__)
@nobel_bp.route("/", methods=["GET"])
def get_nobel_prizes():
    limit = int(request.args.get("limit", 10))
    offset = int(request.args.get("offset", 0))
    category = request.args.get("category")

    filters = []
    if category and category != "all":
        filters.append(f"?prize nobel:category <{category}> .")
    filter_str = "\n".join(filters)

    subquery = f"""
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

        SELECT DISTINCT ?prize
        WHERE {{
          ?prize a nobel:NobelPrize ;
                 nobel:year ?year .
          {filter_str}
        }}
        ORDER BY DESC(xsd:integer(?year))
        LIMIT {limit}
        OFFSET {offset}
    """

    try:
        prize_rows, _ = run_sparql_strict(subquery)
        if not prize_rows:
            return jsonify({"data": [], "meta": {"limit": limit, "offset": offset, "count": 0}})

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

        rows, _ = run_sparql_strict(full_query)
        prizes = {}

        for r in rows:
            prize_uri = r["prize"]["value"]
            if prize_uri not in prizes:
                prizes[prize_uri] = {
                    "id": prize_uri,
                    "year": r["year"]["value"],
                    "category": r["category"]["value"],
                    "laureates": set(),
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

        return jsonify({
            "data": result,
            "meta": {"limit": limit, "offset": offset, "count": len(result)}
        })

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502


@nobel_bp.route("/count", methods=["GET"])
def count_nobel_prizes():
    category = request.args.get("category")

    filters = []
    if category and category != "all":
        filters.append(f"?prize nobel:category <{category}> .")

    filter_str = "\n".join(filters)

    query = f"""
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>
        SELECT (COUNT(DISTINCT ?prize) AS ?total)
        WHERE {{
          ?prize a nobel:NobelPrize ;
                 nobel:year ?year .
          {filter_str}
        }}
    """
    try:
        rows, _ = run_sparql_strict(query)
        total = int(rows[0]["total"]["value"]) if rows else 0
        return jsonify({"total": total})
    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502

@nobel_bp.route("/stats", methods=["GET"])
def nobel_statistics():
    category = request.args.get("category")
    year_from = request.args.get("yearFrom")
    year_to = request.args.get("yearTo")

    filters = []
    if category and category != "all":
        filters.append(f"?prize nobel:category <{category}> .")

    if year_from and year_from.isdigit():
        filters.append(f"FILTER(xsd:integer(?year) >= {int(year_from)})")
    if year_to and year_to.isdigit():
        filters.append(f"FILTER(xsd:integer(?year) <= {int(year_to)})")

    filter_str = "\n".join(filters)

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

    try:
        rows, _ = run_sparql_strict(per_category_query)
        totals_rows, _ = run_sparql_strict(totals_query)

        total_prizes = int(totals_rows[0]["totalPrizes"]["value"]) if totals_rows else 0
        total_laureates = int(totals_rows[0]["totalLaureates"]["value"]) if totals_rows else 0

        categories = {}
        laureates_per_category = {}

        for r in rows or []:
            cat_uri = r["category"]["value"]
            cat_name = cat_uri.split("/")[-1].replace("_", " ")
            categories[cat_name] = int(r["prizeCount"]["value"])
            laureates_per_category[cat_name] = int(r["laureateCount"]["value"])

        return jsonify({
            "totalPrizes": total_prizes,
            "totalLaureates": total_laureates,
            "categories": categories,
            "laureatesPerCategory": laureates_per_category,  # dacă vrei să faci și al doilea chart
            "filters": {
                "category": category or "all",
                "yearFrom": year_from,
                "yearTo": year_to
            }
        })

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502

