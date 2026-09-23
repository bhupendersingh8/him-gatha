import os, json
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import subprocess

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(BACKEND_DIR)
DB_PATH = os.path.join(BACKEND_DIR, 'kuldev_db.tsv')
SLIDES_PATH = os.path.join(BACKEND_DIR, 'hero_slides.tsv')
BUILD_CMD = ['python', 'build.py']

DEITY_FIELDS = ['id','name','district','village','history','image',
                'video','map','links','gurName','travelGuide','devKhel','oracleRecords',
                'kardar','pujari','bhandari','bajantris','chharidhar']

SLIDE_FIELDS = ['id', 'title', 'subtitle', 'imageUrl', 'deityId']

def read_tsv(path):
    rows = []
    if not os.path.exists(path): return rows
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n\r')
            if line.strip():
                rows.append(line.split('\t'))
    return rows

def write_tsv(path, rows):
    with open(path, 'w', encoding='utf-8') as f:
        for r in rows:
            f.write('\t'.join(r) + '\n')
    subprocess.run(BUILD_CMD, cwd=BACKEND_DIR)

class APIServer(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        if not body:
            self.send_response(400)
            self.end_headers()
            return
            
        data = json.loads(body)
        
        if self.path.startswith('/api/deities'):
            rows = read_tsv(DB_PATH)
            updated = False
            for i, r in enumerate(rows):
                if r[0] == data.get('id'):
                    new_row = [data.get(f, '') for f in DEITY_FIELDS]
                    for j in range(len(DEITY_FIELDS)):
                        if not data.get(DEITY_FIELDS[j]) and j < len(r):
                            new_row[j] = r[j]
                    rows[i] = new_row
                    updated = True
                    break
            if not updated:
                rows.insert(0, [data.get(f, '') for f in DEITY_FIELDS])
            write_tsv(DB_PATH, rows)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status':'ok'}).encode())
            return
            
        elif self.path.startswith('/api/slides'):
            rows = read_tsv(SLIDES_PATH)
            updated = False
            for i, r in enumerate(rows):
                if r[0] == data.get('id'):
                    new_row = [data.get(f, '') for f in SLIDE_FIELDS]
                    for j in range(len(SLIDE_FIELDS)):
                        if not data.get(SLIDE_FIELDS[j]) and j < len(r):
                            new_row[j] = r[j]
                    rows[i] = new_row
                    updated = True
                    break
            if not updated:
                rows.append([data.get(f, '') for f in SLIDE_FIELDS])
            write_tsv(SLIDES_PATH, rows)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status':'ok'}).encode())
            return
            
        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        parsed_path = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed_path.query)
        del_id = query.get('id', [None])[0]
        
        if self.path.startswith('/api/deities'):
            if del_id:
                rows = read_tsv(DB_PATH)
                new_rows = [r for r in rows if r[0] != del_id]
                write_tsv(DB_PATH, new_rows)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status':'deleted'}).encode())
            return
            
        elif self.path.startswith('/api/slides'):
            if del_id:
                rows = read_tsv(SLIDES_PATH)
                new_rows = [r for r in rows if r[0] != del_id]
                write_tsv(SLIDES_PATH, new_rows)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status':'deleted'}).encode())
            return

if __name__ == '__main__':
    os.chdir(WORKSPACE_DIR)
    port = 8080
    server = HTTPServer(('0.0.0.0', port), APIServer)
    print(f"API + Static Server running on port {port}")
    server.serve_forever()
