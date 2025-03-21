# backend docker file

FROM python:3.13.1

WORKDIR /src

COPY requirments.txt

RUN pip install --no-cahce-dir -r requirments.txt

COPY ./src /app/src

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
