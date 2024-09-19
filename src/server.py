from flask import Flask, Response, render_template, request
import cv2
import subprocess
from ultralytics import YOLO  # For YOLOv8 model

# Initialize Flask app
app = Flask(__name__)

# Load the YOLOv8 model
model = YOLO('src/best_cola.pt')

def get_youtube_stream_url(video_url):
    ytdlp_cmd = [
        'yt-dlp',
        '-f', 'best',
        '-g', video_url
    ]
    process = subprocess.Popen(ytdlp_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        stream_url = stdout.decode('utf-8').strip()
        return stream_url
    else:
        raise OSError(f"Error fetching video stream URL: {stderr.decode('utf-8')}")

@app.route('/video_feed')
def video_feed():
    youtube_url = request.args.get('youtube_url')
    if youtube_url:
        try:
            stream_url = get_youtube_stream_url(youtube_url)
            cap = cv2.VideoCapture(stream_url)

            def detect_and_stream():
                while True:
                    success, frame = cap.read()
                    if not success:
                        break
                    else:
                        # Perform inference with YOLOv8 model
                        results = model(frame)
                        annotated_frame = results[0].plot()  # Render results on the frame

                        # Encode the frame as JPEG to stream to the browser
                        ret, buffer = cv2.imencode('.jpg', annotated_frame)
                        frame = buffer.tobytes()

                        # Yield the frame to be displayed in the HTML page
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            return Response(detect_and_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')
        except OSError as e:
            return str(e)
    else:
        return "No YouTube URL provided."

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        youtube_url = request.form.get('youtubeURL')
        if youtube_url:
            return render_template('index.html', youtube_url=youtube_url)
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)

