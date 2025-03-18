FROM python:3.12.1-alpine

ENV TZ="America/Lima"

RUN apk add --no-cache tzdata

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1 

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev build-base freetype-dev libpng-dev openblas-dev openssh-client

RUN pip install --upgrade pip 
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh . 
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh 
RUN chmod +x /usr/src/app/entrypoint.sh 

COPY . . 

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]

