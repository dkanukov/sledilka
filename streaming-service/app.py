from flask import Flask, Response, request
from generate_frame import generate_frame, get_one_frame
import requests


app = Flask("stream")

@app.route("/", methods=['GET'])
def stream():
    args = request.args
    return Response(generate_frame(args.get("url")), mimetype="multipart/x-mixed-replace")

@app.route("/isLowLight/", methods=["GET"])
def is_low_lighted():
    args = request.args
    frame = get_one_frame(args.get("url"))
    if frame is None:
        return Response(status=404)
    files = {
    'file': frame
    }
    resp = requests.post("http://imaging-service:8088/", files=files)
    print(resp.text)
    return Response(resp.text, mimetype="application/json")


if __name__=="__main__":
    app.run(host="0.0.0.0", port=8181)