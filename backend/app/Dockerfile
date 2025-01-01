FROM public.ecr.aws/docker/library/python:3.12.0-slim-bullseye
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /app
ADD . .
RUN pip3 install --no-cache-dir -r requirements.txt

ENV AWS_LWA_INVOKE_MODE RESPONSE_STREAM
CMD ["python", "main.py"]
