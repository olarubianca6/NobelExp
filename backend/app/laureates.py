# laureates.py
from flask import Blueprint, jsonify, request
from sparql import run_sparql_strict, SparqlError

laureat_bp = Blueprint("laureat", __name__)

@laureat_bp.route("/", methods=["GET"])
def get_laureates():
    query = """
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>
        
        SELECT ?id ?name WHERE {
          ?l a nobel:Laureate .
          ?l foaf:name ?name .
          BIND( STRAFTER(STR(?l), "/laureate/") AS ?id )
        }
        ORDER BY xsd:integer(?id)
        """
    try:
        rows, meta = run_sparql_strict(query)

        if not rows:
            return jsonify({
                "error": "Empty result",
                "hint": "Query valid but matched 0 rows.",
                "meta": meta
            }), 404

        data = [
            {
                "id": r.get("id", {}).get("value"),
                "name": r.get("name", {}).get("value")
            }
            for r in rows
        ]

        return jsonify(data)

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "contentType": e.content_type,
            "details": e.body_preview
        }), 502


@laureat_bp.route("/<id>", methods=["GET"])
def get_laureate_by_id(id):
    if not id.isdigit():
        return jsonify({"error": "Invalid id"}), 400

    query = f"""
        PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
        PREFIX nobel: <http://data.nobelprize.org/terms/>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbp:   <http://dbpedia.org/property/>
        PREFIX dbo:   <http://dbpedia.org/ontology/>
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        
        SELECT DISTINCT ?givenName ?familyName ?gender
           ?birthDate ?deathDate ?birthPlaceLabel ?deathPlaceLabel
           ?awardLabel ?prizeLabel ?affiliationLabel 
        WHERE {{
          BIND(<http://data.nobelprize.org/resource/laureate/{id}> AS ?l)
          OPTIONAL {{ ?l foaf:givenName ?givenName }}
          OPTIONAL {{ ?l foaf:familyName ?familyName }}
          OPTIONAL {{ ?l foaf:gender ?gender }}
          OPTIONAL {{ ?l nobel:laureateAward ?award }}
          OPTIONAL {{ ?l nobel:nobelPrize ?prize }}
          OPTIONAL {{ ?l dbp:dateOfBirth ?birthDate }}
          OPTIONAL {{ ?l dbp:dateOfDeath ?deathDate }}
          OPTIONAL {{
            ?l dbo:affiliation ?affiliation .
            OPTIONAL {{ ?affiliation rdfs:label ?affiliationLabel . FILTER(LANG(?affiliationLabel) = "en") }} 
          }}
          OPTIONAL {{
            ?l dbo:birthPlace ?birthPlace .
            OPTIONAL {{ ?birthPlace rdfs:label ?birthPlaceLabel . FILTER(LANG(?birthPlaceLabel) = "en") }} . 
            FILTER(LANG(?birthPlace) = "en")
          }}
          OPTIONAL {{
            ?l dbo:deathPlace ?deathPlace .
            OPTIONAL {{ ?deathPlace rdfs:label ?deathPlaceLabel . FILTER(LANG(?deathPlaceLabel) = "en") }}  . 
            FILTER(LANG(?dethPlace) = "en")
          }}
          OPTIONAL {{ ?prize rdfs:label ?prizeLabel . FILTER(LANG(?prizeLabel) = "en") }}
          OPTIONAL {{ ?award rdfs:label ?awardLabel . FILTER(LANG(?awardLabel) = "en") }}
          BIND( COALESCE(?prizeLabel, REPLACE(STR(?prize), "^.*/nobelprize/", ""))  AS ?prizeText )
          BIND( COALESCE(?awardLabel, REPLACE(STR(?award), "^.*/laureateaward/", "")) AS ?awardText )
        }}"""
    try:
        rows, meta = run_sparql_strict(query)

        if not rows:
            return jsonify({
                "error": "Laureate not found",
                "meta": meta
            }), 404

        return jsonify(rows)

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "contentType": e.content_type,
            "details": e.body_preview
        }), 502
