from SPARQLWrapper import SPARQLWrapper, JSON, POST
import json
import time
from urllib.error import HTTPError

SPARQL_URL = "https://data.nobelprize.org/store/sparql"


class SparqlError(RuntimeError):
    def __init__(self, status=None, content_type=None, body_preview=None, where=None):
        super().__init__(f"SPARQL {status} CT={content_type} @ {where}: {body_preview}")
        self.status = status
        self.content_type = content_type
        self.body_preview = body_preview
        self.where = where


def run_sparql_strict(query: str, method: str = "POST"):
    s = SPARQLWrapper(SPARQL_URL)
    s.setMethod(POST if method.upper() == "POST" else s.GET)
    s.setReturnFormat(JSON)
    s.addParameter("format", "json")
    s.addCustomHttpHeader("Accept", "application/sparql-results+json")
    s.setQuery(query)

    t0 = time.time()
    try:
        res = s.query()
        data = res.convert()
    except HTTPError as e:
        ct = e.headers.get("Content-Type") if hasattr(e, "headers") else None
        body = getattr(e, "read", lambda: b"")()
        preview = body.decode("utf-8", errors="replace")[:400]
        raise SparqlError(status=getattr(e, "code", None), content_type=ct, body_preview=preview, where="query()") from e
    except Exception as e:
        raise SparqlError(where="query()", body_preview=str(e)) from e

    if isinstance(data, (bytes, bytearray)):
        try:
            data = json.loads(data.decode("utf-8", errors="replace"))
        except Exception as e:
            raise SparqlError(content_type="bytes", body_preview=str(e), where="convert()") from e

    if "results" not in data or "bindings" not in data["results"]:
        preview = json.dumps({k: data[k] for k in list(data.keys())[:3]}, ensure_ascii=False)[:400]
        raise SparqlError(content_type="json", body_preview=f"unexpected payload: {preview}", where="shape-check")

    meta = {
        "endpoint": SPARQL_URL,
        "method": method.upper(),
        "elapsed_ms": int((time.time() - t0) * 1000),
    }
    return data["results"]["bindings"], meta
