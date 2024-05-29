import cv2


class VideoCamera(object):
    def __init__(self, video_source: str):
        self.video = cv2.VideoCapture(video_source)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ok, image = self.video.read()
        if not ok:
            return None
        ok, jpeg = cv2.imencode('.jpg', image)
        if not ok:
            return None
        return jpeg.tobytes()
