import cv2, time


class VideoCamera(object):
    def __init__(self, video_source : str):
        self.video = cv2.VideoCapture(video_source)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        _, image = self.video.read()
        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()