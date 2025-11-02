from flask import Blueprint, jsonify, request
from sparql import run_sparql_strict, SparqlError

nobel_bp = Blueprint("nobel", __name__)

@nobel_bp.route("/", methods=["GET"])
def get_nobel_prizes():
    limit = int(request.args.get("limit", 10))
    offset = int(request.args.get("offset", 0))

    subquery = f"""
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

        SELECT DISTINCT ?prize
        WHERE {{
          ?prize a nobel:NobelPrize ;
                 nobel:year ?year .
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
    query = """
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        SELECT (COUNT(DISTINCT ?prize) AS ?total)
        WHERE { ?prize a nobel:NobelPrize . }
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
    query = """
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

        SELECT ?category (COUNT(DISTINCT ?prize) AS ?prizeCount) (COUNT(DISTINCT ?laureate) AS ?laureateCount)
        WHERE {
          ?prize a nobel:NobelPrize ;
                 nobel:category ?category ;
                 nobel:laureate ?laureate .
          ?laureate foaf:name ?laureateName .
        }
        GROUP BY ?category
        ORDER BY DESC(xsd:integer(?prizeCount))
    """
    try:
        rows, _ = run_sparql_strict(query)

        if not rows:
            return jsonify({
                "totalPrizes": 0,
                "totalLaureates": 0,
                "categories": {}
            })

        categories = {}
        total_prizes = 0

        for r in rows:
            cat_uri = r["category"]["value"]
            cat_name = cat_uri.split("/")[-1].replace("_", " ")
            count = int(r["prizeCount"]["value"])
            categories[cat_name] = count
            total_prizes += count

        total_query = """
            PREFIX nobel: <http://data.nobelprize.org/terms/>
            PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
            SELECT (COUNT(DISTINCT ?laureate) AS ?totalLaureates)
            WHERE { ?laureate a foaf:Person . }
        """
        total_rows, _ = run_sparql_strict(total_query)
        total_laureates = int(total_rows[0]["totalLaureates"]["value"]) if total_rows else 0

        return jsonify({
            "totalPrizes": total_prizes,
            "totalLaureates": total_laureates,
            "categories": categories
        })

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502
