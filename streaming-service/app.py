import time
from flask import Flask, Response, request
from generate_frame import VideoCamera
import requests

app = Flask("stream")

camera_instance = None  # Maintain a single instance of VideoCamera

def get_camera_instance(url):
    global camera_instance
    if camera_instance is None:
        camera_instance = VideoCamera(url)
    return camera_instance

def gen(camera):
    while True:
        frame = camera.get_frame()
        if frame:
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        else:
            break  # Stops the stream if no frame is available

@app.route("/", methods=['GET'])
def stream():
    args = request.args
    camera = get_camera_instance(args.get("url"))
    return Response(gen(camera), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/isLowLight/", methods=["GET"])
def is_low_lighted():
    args = request.args
    camera = get_camera_instance(args.get("url"))
    frame = camera.get_frame()
    if frame is None:
        return Response("No frame available", status=404)
    files = {'file': ('frame.jpg', frame, 'image/jpeg')}
    try:
        resp = requests.post("http://imaging-service:8088/", files=files)
        return Response(resp.text, mimetype="application/json")
    except requests.RequestException as e:
        return Response(str(e), status=500)

if __name__=="__main__":
    app.run(host="0.0.0.0", port=8181, threaded=True)
