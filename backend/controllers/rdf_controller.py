from flask import Blueprint, request, jsonify, Response
from flask_login import login_required, current_user

from services.rdf_service import (
    export_turtle,
    sparql_to_json_str,
    list_likes as svc_list_likes,
    add_like as svc_add_like,
    remove_like as svc_remove_like,
)

rdf_bp = Blueprint("rdf", __name__)

@rdf_bp.get("/likes")
@login_required
def get_likes():
    return jsonify({"data": svc_list_likes(current_user.id)})


@rdf_bp.post("/likes")
@login_required
def add_like():
    body = request.get_json(silent=True) or {}
    uri = (body.get("uri") or "").strip()
    kind = (body.get("kind") or "").strip()

    if not uri:
        return jsonify({"error": "Missing 'uri'"}), 400
    if not kind:
        return jsonify({"error": "Missing 'kind'"}), 400

    svc_add_like(
        user_id=current_user.id,
        mail=current_user.mail,
        uri=uri,
        kind=kind,
    )

    return jsonify({"message": "Saved as RDF Like", "uri": uri, "kind": kind}), 201


@rdf_bp.delete("/likes")
@login_required
def delete_like():
    uri = (request.args.get("uri") or "").strip()
    if not uri:
        return jsonify({"error": "Missing 'uri' query param"}), 400

    removed = svc_remove_like(current_user.id, uri)
    return jsonify({"message": "Removed", "removed": removed})
