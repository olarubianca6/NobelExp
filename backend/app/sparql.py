from SPARQLWrapper import JSON
import urllib.request, urllib.parse, ssl, json, time
from urllib.error import HTTPError

SPARQL_URL = "https://data.nobelprize.org/store/sparql"
CTX = ssl._create_unverified_context()

class SparqlError(RuntimeError):
    def __init__(self, status=None, content_type=None, body_preview=None, where=None):
        super().__init__(f"SPARQL {status} CT={content_type} @ {where}: {body_preview}")
        self.status = status
        self.content_type = content_type
        self.body_preview = body_preview
        self.where = where

def run_sparql_strict(query: str, method: str = "POST"):
    encoded = urllib.parse.urlencode({"query": query}).encode("utf-8")

    req = urllib.request.Request(
        SPARQL_URL,
        data=encoded,
        headers={"Accept": "application/sparql-results+json"},
        method="POST"
    )

    t0 = time.time()
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=30) as res:
            data = json.loads(res.read().decode("utf-8"))
            status = res.status
            content_type = res.headers.get("Content-Type")
    except HTTPError as e:
        ct = e.headers.get("Content-Type") if hasattr(e, "headers") else None
        body = getattr(e, "read", lambda: b"")()
        preview = body.decode("utf-8", errors="replace")[:400]
        raise SparqlError(status=getattr(e, "code", None), content_type=ct, body_preview=preview, where="urllib") from e

    if "results" not in data or "bindings" not in data["results"]:
        preview = json.dumps({k: data[k] for k in list(data.keys())[:3]}, ensure_ascii=False)[:400]
        raise SparqlError(content_type=content_type, body_preview=f"unexpected payload: {preview}", where="shape-check")

    return data["results"]["bindings"], {
        "endpoint": SPARQL_URL,
        "method": method,
        "elapsed_ms": int((time.time() - t0) * 1000),
    }