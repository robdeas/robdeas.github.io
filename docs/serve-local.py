from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import webbrowser

HOST = "127.0.0.1"
PORT = 8007
SITE_DIR = Path(__file__).resolve().parent / "static-site"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print("%s - %s" % (self.address_string(), format % args))


if __name__ == "__main__":
    if not (SITE_DIR / "index.html").exists():
        raise SystemExit(f"Could not find site index: {SITE_DIR / 'index.html'}")

    os.chdir(SITE_DIR)
    url = f"http://{HOST}:{PORT}/"
    print(f"Serving {SITE_DIR}")
    print(f"Open {url}")
    webbrowser.open(url)
    ThreadingHTTPServer((HOST, PORT), QuietHandler).serve_forever()
