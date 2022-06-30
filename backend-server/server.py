from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import os
import json
#global variable for prototype, should be replaced in release version.

musicalData={}
count=0
def on_server_running():
    ls=os.listdir('./data') #read all files in data folder, not safe method, should use database
    for filename in ls:
        f = open('./data/{}'.format(filename), 'r')
        s=f.read()
        musicalData[filename]=s.split(' ')
        print(s)
        f.close()



class S(BaseHTTPRequestHandler):
    def _set_response(self,data=None):
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
                str(self.path), str(self.headers), post_data.decode('utf-8'))
        data= post_data.decode('utf-8')
        b=json.loads(data)

        b['userId']=b['userId']+'response'
        self._set_response()
        b['Instruction']=musicalData['data1.txt']
        length=len(b['Instruction'])
        global count
        b['Instruction']=b['Instruction'][count%length]
        count+=1
        print('b',b)
        print('===')
        self.wfile.write( json.dumps(b).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    






def run(server_class=HTTPServer, handler_class=S, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    on_server_running()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()