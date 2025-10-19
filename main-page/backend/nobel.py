from flask import Blueprint, jsonify
import requests

nobel_bp = Blueprint("nobel", __name__)


@nobel_bp.route("/", methods=["GET"])
def get_nobel_data():
    try:
        response = requests.get("https://api.nobelprize.org/v1/prize.json")
        data = response.json()
        laureates = []

        for prize in data.get("prizes", []):
            year = prize.get("year")
            category = prize.get("category")
            for laureate in prize.get("laureates", []):
                name = (laureate.get("firstname", "") + " " + laureate.get("surname", "")).strip()
                laureates.append({
                    "name": name,
                    "category": category,
                    "year": int(year)
                })

        return jsonify(laureates)
    except Exception as e:
        return jsonify({"error": "Failed to fetch Nobel data", "details": str(e)}), 500
