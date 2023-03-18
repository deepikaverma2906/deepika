FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

COPY requirements.txt /


RUN apt-get update \
  && apt-get install -y python3-pip python3-dev cmake \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 --no-cache-dir install --upgrade pip \
  && rm -rf /var/lib/apt/lists/* \
  && pip3 install -r /requirements.txt 

COPY dispatcher.py /
COPY run.sh /
RUN mkdir imp_files
RUN chmod +x run.sh
RUN rm -f requirements.txt
ENTRYPOINT ["/run.sh"]