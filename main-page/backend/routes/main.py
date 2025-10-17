from flask import Blueprint, jsonify
from ..models import Item
from ..app import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/data', methods=['GET'])
def get_data():
    items = Item.query.all()
    data = [{'id': item.id, 'name': item.name, 'value': item.value} for item in items]
    return jsonify(data)

@main_bp.route('/data', methods=['POST'])
def add_item():
    from flask import request
    data = request.get_json()
    if not data or not data.get('name') or not data.get('value'):
        return jsonify({'error': 'Missing fields'}), 400

    new_item = Item(name=data['name'], value=data['value'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item added', 'item': {'id': new_item.id, 'name': new_item.name, 'value': new_item.value}})