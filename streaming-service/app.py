import time

from flask import Flask, Response, request
from generate_frame import VideoCamera
import requests


app = Flask("stream")


def gen(camera : VideoCamera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route("/", methods=['GET'])
def stream():
    args = request.args
    return Response(gen(VideoCamera(args.get("url"))), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/isLowLight/", methods=["GET"])
def is_low_lighted():
    args = request.args
    frame = VideoCamera(args.get("url")).get_frame()
    if frame is None:
        return Response(status=404)
    files = {
    'file': frame
    }
    resp = requests.post("http://imaging-service:8088/", files=files)
    print(resp.text)
    return Response(resp.text, mimetype="application/json")


if __name__=="__main__":
    # http_server = WSGIServer(('', 8181), app)
    # http_server.serve_forever()

    app.run(host="0.0.0.0", port=8181)



# @app.route('/video_feed')
# def video_feed():
#     return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')