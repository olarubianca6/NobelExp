from flask import Blueprint, jsonify
from sparql import SparqlError
from services.laureates_service import fetch_laureates, fetch_laureate_by_id

laureat_bp = Blueprint("laureat", __name__)


@laureat_bp.route("/", methods=["GET"])
def get_laureates():
    try:
        data, meta = fetch_laureates()

        if not data:
            return jsonify({
                "error": "Empty result",
                "hint": "Query valid but matched 0 rows.",
                "meta": meta
            }), 404

        return jsonify(data)

    except SparqlError as e:
        return jsonify({
            "error": "SPARQL failed",
            "status": e.status,
            "contentType": e.content_type,
            "details": e.body_preview
        }), 502


@laureat_bp.route("/<id>", methods=["GET"])
def get_laureate_by_id_route(id):
    if not id.isdigit():
        return jsonify({"error": "Invalid id"}), 400

    try:
        rows, meta = fetch_laureate_by_id(id)

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
