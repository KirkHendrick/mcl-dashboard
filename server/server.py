#! /usr/bin/env python3

import cherrypy
import json
from dashboard_api import DashboardApi
from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from ws4py.websocket import WebSocket
from secrets import CORS_ALLOW_ORIGIN, SOCKET_HOST

class DashboardSocket(object):
    @cherrypy.expose
    def index(self):
        return 'index test'

    @cherrypy.expose
    def ws(self):
        handler = cherrypy.request.ws_handler

class DashboardWebSocketHandler(WebSocket):
    wsset = set()

    def opened(self):
        print('server: connection opened')
        self.wsset.add(self)

    def closed(self, code, reason=''):
        self.wsset.remove(self)

    def received_message(self, message):
        print('client: ' + str(message))
        request = json.loads(str(message))

        if hasattr(DashboardApi, request['method']):
            response = getattr(DashboardApi, request['method'])(payload=request['payload'] if 'payload' in request else None, socket=self)
        else:
            response = {'res': 'No method found with name ' + request}

    def send_json(self, d):
        self.send(bytearray(json.dumps(d).encode()))

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = CORS_ALLOW_ORIGIN
    cherrypy.response.headers["Access-Control-Allow-Credentials"] = 'true'
    cherrypy.response.headers["Access-Control-Allow-Headers"] = ["Origin", "Content-Type", "X-Auth-Token"]


if __name__ == '__main__':
    conf = {
        '/': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'application/json')],
            'tools.encode.on': True,
            'tools.encode.encoding': 'utf-8',
            'tools.CORS.on': True,
        }
    }

    cherrypy.config.update({'server.socket_port': 9000})
    WebSocketPlugin(cherrypy.engine).subscribe()
    cherrypy.tools.websocket = WebSocketTool()

    websocket_config = {
        '/': {
            'tools.CORS.on': True,
        },
        '/ws': {'tools.websocket.on': True,
                'tools.websocket.handler_cls': DashboardWebSocketHandler}
    }

    cherrypy.tools.CORS = cherrypy.Tool('before_finalize', CORS)
    cherrypy.server.socket_host = SOCKET_HOST

    cherrypy.quickstart(DashboardSocket(), '/', config=websocket_config)
