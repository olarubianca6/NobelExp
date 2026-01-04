from stores.rdf_store import RdfStore

_store = RdfStore()


def export_turtle() -> str:
    return _store.export_turtle()


def sparql_to_json_str(query: str) -> str:
    return _store.sparql_json(query)


def list_likes(user_id: int):
    return _store.list_likes(user_id)


def add_like(user_id: int, mail: str, uri: str, kind: str) -> None:
    _store.add_like(user_id=user_id, mail=mail, object_uri=uri, kind=kind)


def remove_like(user_id: int, uri: str) -> int:
    return _store.remove_like(user_id, uri)
