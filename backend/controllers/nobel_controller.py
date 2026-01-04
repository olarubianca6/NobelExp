from flask import Blueprint, jsonify, request
from sparql import SparqlError
from services.nobel_service import (
    fetch_nobel_prizes,
    count_nobel_prizes,
    fetch_nobel_statistics,
)

nobel_bp = Blueprint("nobel", __name__)


@nobel_bp.route("/", methods=["GET"])
def get_nobel_prizes_route():
    try:
        limit = int(request.args.get("limit", 10))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        return jsonify({"error": "limit/offset must be integers"}), 400

    if limit < 0 or offset < 0:
        return jsonify({"error": "limit/offset must be >= 0"}), 400

    category = request.args.get("category")

    try:
        data, meta = fetch_nobel_prizes(limit=limit, offset=offset, category=category)
        return jsonify({"data": data, "meta": meta})
    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502


@nobel_bp.route("/count", methods=["GET"])
def count_nobel_prizes_route():
    category = request.args.get("category")
    try:
        total = count_nobel_prizes(category=category)
        return jsonify({"total": total})
    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502


@nobel_bp.route("/stats", methods=["GET"])
def nobel_statistics_route():
    category = request.args.get("category")
    year_from = request.args.get("yearFrom")
    year_to = request.args.get("yearTo")

    try:
        payload = fetch_nobel_statistics(category=category, year_from=year_from, year_to=year_to)
        return jsonify(payload)
    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "details": e.body_preview
        }), 502
