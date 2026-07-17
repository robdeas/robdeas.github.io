from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import webbrowser

HOST = "127.0.0.1"
PORT = 8007


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print("%s - %s" % (self.address_string(), format % args))


if __name__ == "__main__":
    site_dir = Path(__file__).resolve().parent
    import os
    os.chdir(site_dir)
    url = f"http://{HOST}:{PORT}/"
    print(f"Serving {site_dir}")
    print(f"Open {url}")
    webbrowser.open(url)
    ThreadingHTTPServer((HOST, PORT), QuietHandler).serve_forever()