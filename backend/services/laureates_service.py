from sparql import run_sparql_strict


def fetch_laureates():
    rows, meta = run_sparql_strict("""
PREFIX nobel: <http://data.nobelprize.org/terms/>
PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

SELECT ?id ?name WHERE {
  ?l a nobel:Laureate .
  ?l foaf:name ?name .
  BIND( STRAFTER(STR(?l), "/laureate/") AS ?id )
}
ORDER BY xsd:integer(?id)
""")

    if not rows:
        return None, meta

    data = [
        {
            "id": r.get("id", {}).get("value"),
            "name": r.get("name", {}).get("value"),
        }
        for r in rows
    ]
    return data, meta


def fetch_laureate_by_id(laureate_id: str):
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
  BIND(<http://data.nobelprize.org/resource/laureate/{laureate_id}> AS ?l)

  OPTIONAL {{ ?l foaf:givenName ?givenName }}
  OPTIONAL {{ ?l foaf:familyName ?familyName }}
  OPTIONAL {{ ?l foaf:gender ?gender }}
  OPTIONAL {{ ?l nobel:laureateAward ?award }}
  OPTIONAL {{ ?l nobel:nobelPrize ?prize }}
  OPTIONAL {{ ?l dbp:dateOfBirth ?birthDate }}
  OPTIONAL {{ ?l dbp:dateOfDeath ?deathDate }}

  OPTIONAL {{
    ?l dbo:affiliation ?affiliation .
    OPTIONAL {{ ?affiliation rdfs:label ?affiliationLabel .
               FILTER(LANG(?affiliationLabel) = "en") }}
  }}

  OPTIONAL {{
    ?l dbo:birthPlace ?birthPlace .
    OPTIONAL {{ ?birthPlace rdfs:label ?birthPlaceLabel .
               FILTER(LANG(?birthPlaceLabel) = "en") }}
  }}

  OPTIONAL {{
    ?l dbo:deathPlace ?deathPlace .
    OPTIONAL {{ ?deathPlace rdfs:label ?deathPlaceLabel .
               FILTER(LANG(?deathPlaceLabel) = "en") }}
  }}

  OPTIONAL {{ ?prize rdfs:label ?prizeLabel . FILTER(LANG(?prizeLabel) = "en") }}
  OPTIONAL {{ ?award rdfs:label ?awardLabel . FILTER(LANG(?awardLabel) = "en") }}
}}
"""
    rows, meta = run_sparql_strict(query)

    if not rows:
        return None, meta

    return rows, meta
