import cv2, time

def generate_frame(url: str):
    cap = cv2.VideoCapture(url)
    while True:
        start = time.perf_counter()
        success, frame = cap.read()
        if not success:
            break

        ret, buf = cv2.imencode(".jpg", frame)

        if not ret:
            break
        frame_bytes = buf.tobytes()
        diff = time.perf_counter() - start
        diff = 0 if diff < 0 else diff
        time.sleep(0.04-diff)
        yield(b"--frame\r\n"
              b"Content-Type: image/jpg\r\n\r\n" + frame_bytes + b"\r\n\r\n"
              )