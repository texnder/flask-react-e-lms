FROM python:latest

LABEL maintainer="inderjeetchohana1431996@gamil.com"

WORKDIR /elms

COPY requirements.txt .

COPY . /elms

RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT [ "python" ]

CMD ["main.py"]