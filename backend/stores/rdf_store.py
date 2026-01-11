from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import threading
from typing import Optional

from rdflib import Graph, Namespace, URIRef, Literal, BNode
from rdflib.namespace import RDF, FOAF, XSD


AS = Namespace("https://www.w3.org/ns/activitystreams#")
SCHEMA = Namespace("https://schema.org/")
NEXP = Namespace("https://nobel-explorer.example/ns#")

_LOCK = threading.RLock()


@dataclass(frozen=True)
class RdfConfig:
    ttl_path: Path


def _default_config() -> RdfConfig:
    base = Path(__file__).resolve().parent
    return RdfConfig(ttl_path=base / "../instance" / "local.ttl")


class RdfStore:
    def __init__(self, cfg: Optional[RdfConfig] = None):
        self.cfg = cfg or _default_config()
        self.cfg.ttl_path.parent.mkdir(parents=True, exist_ok=True)
        self._graph: Optional[Graph] = None

    def graph(self) -> Graph:
        with _LOCK:
            if self._graph is None:
                g = Graph()
                g.bind("foaf", FOAF)
                g.bind("as", AS)
                g.bind("schema", SCHEMA)
                g.bind("nexp", NEXP)

                if self.cfg.ttl_path.exists():
                    g.parse(self.cfg.ttl_path, format="turtle")

                self._graph = g
            return self._graph

    def save(self) -> None:
        with _LOCK:
            g = self.graph()
            g.serialize(destination=str(self.cfg.ttl_path), format="turtle")

    @staticmethod
    def user_uri(user_id: int) -> URIRef:
        return URIRef(f"urn:nobel-explorer:user:{user_id}")

    def ensure_user(self, user_id: int, mail: str) -> URIRef:
        g = self.graph()
        u = self.user_uri(user_id)

        g.add((u, RDF.type, FOAF.Person))
        g.add((u, FOAF.mbox, URIRef(f"mailto:{mail}")))
        g.add((u, SCHEMA.mail, Literal(mail)))
        return u

    def add_like(self, user_id: int, mail: str, object_uri: str, kind: str) -> None:
        g = self.graph()
        actor = self.ensure_user(user_id, mail)

        like = BNode()
        now = datetime.now(timezone.utc).isoformat()

        g.add((like, RDF.type, AS.Like))
        g.add((like, AS.actor, actor))
        g.add((like, AS.object, URIRef(object_uri)))
        g.add((like, SCHEMA.dateCreated, Literal(now, datatype=XSD.dateTime)))
        g.add((like, NEXP.kind, Literal(kind)))

        self.save()

    def remove_like(self, user_id: int, object_uri: str) -> int:
        g = self.graph()
        actor = self.user_uri(user_id)
        target = URIRef(object_uri)

        likes_to_remove = []
        for like in g.subjects(RDF.type, AS.Like):
            if (like, AS.actor, actor) in g and (like, AS.object, target) in g:
                likes_to_remove.append(like)

        for like in likes_to_remove:
            g.remove((like, None, None))

        if likes_to_remove:
            self.save()

        return len(likes_to_remove)

    def list_likes(self, user_id: int):
        g = self.graph()
        actor = self.user_uri(user_id)

        out = []
        for like in g.subjects(RDF.type, AS.Like):
            if (like, AS.actor, actor) not in g:
                continue

            obj = g.value(like, AS.object)
            kind = g.value(like, NEXP.kind)
            created = g.value(like, SCHEMA.dateCreated)

            out.append(
                {
                    "object": str(obj) if obj else None,
                    "kind": str(kind) if kind else None,
                    "createdAt": str(created) if created else None,
                }
            )

        out.sort(key=lambda x: x["createdAt"] or "", reverse=True)
        return out

    def sparql_json(self, query: str) -> str:
        g = self.graph()
        res = g.query(query)
        return res.serialize(format="json").decode("utf-8")

    def export_turtle(self) -> str:
        g = self.graph()
        return g.serialize(format="turtle")