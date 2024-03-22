from flask import Flask, Response, request
from generate_frame import generate_frame


app = Flask("stream")

@app.route("/", methods=['GET'])
def stream():
    args = request.args
    return Response(generate_frame(args.get("url")), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__=="__main__":
    app.run(host="0.0.0.0", port=8181)