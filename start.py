#!/usr/bin/env python3
"""Run the HALE ATS demo with Python's standard library; no packages required."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('Port must be between 1 and 65535.')
    root = Path(__file__).resolve().parent / 'web'
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    try:
        with ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
            print('HALE ATS local demo', flush=True)
            print('Open http://127.0.0.1:{}'.format(args.port), flush=True)
            print('Press Ctrl+C to stop.', flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass
    except OSError as error:
        parser.exit(1, 'Could not start server: {}. Try a different --port.\n'.format(error))


if __name__ == '__main__':
    main()
