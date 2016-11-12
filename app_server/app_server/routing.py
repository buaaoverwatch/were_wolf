# -*- coding:UTF-8 -*-

from channels.routing import route
from app_server import consumers

channel_routing = [
#route("http.request", "WebSocket.consumers.http_consumer"),
    route("websocket.connect", consumers.ws_connect),		#连接上
    route("websocket.receive", consumers.ws_message),		#发来消息
    route("websocket.disconnect", consumers.ws_disconnect),	#断开连接
]

