from flask import Blueprint, jsonify
from sparql import run_sparql_strict, SparqlError

nobel_bp = Blueprint("nobel", __name__)

@nobel_bp.route("/", methods=["GET"])
def get_nobel_prizes():
    query = """
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

        SELECT ?prize ?year ?category ?laureate ?laureateName WHERE {
          ?prize a nobel:NobelPrize ;
                 nobel:year ?year ;
                 nobel:category ?category ;
                 nobel:laureate ?laureate .

          ?laureate foaf:name ?laureateName .
        }
        ORDER BY DESC(xsd:integer(?year))
    """
    try:
        rows, meta = run_sparql_strict(query)

        if not rows:
            return jsonify({
                "error": "No Nobel Prizes found",
                "meta": meta
            }), 404

        prizes = {}
        for r in rows:
            uri = r["prize"]["value"]
            if uri not in prizes:
                prizes[uri] = {
                    "id": uri,
                    "year": r["year"]["value"],
                    "category": r["category"]["value"],
                    "laureates": set()
                }

            laureate_uri = r["laureate"]["value"]
            laureate_name = r["laureateName"]["value"]

            # folosim tuple ca să păstrăm (id, name)
            prizes[uri]["laureates"].add((laureate_uri, laureate_name))

        result = []
        for prize in prizes.values():
            result.append({
                "id": prize["id"],
                "year": prize["year"],
                "category": prize["category"],
                "laureates": [
                    {
                        "id": l_id,
                        "name": l_name
                    }
                    for (l_id, l_name) in sorted(prize["laureates"], key=lambda x: x[1])
                ],
            })

        return jsonify(result)

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "contentType": e.content_type,
            "details": e.body_preview
        }), 502
