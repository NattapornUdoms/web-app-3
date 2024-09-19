FROM python:3.11.1

WORKDIR /code

COPY requirements.txt /code/
COPY src/ /code/src/

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "src/server.py"]
