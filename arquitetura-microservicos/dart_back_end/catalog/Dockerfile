FROM dart:stable

WORKDIR /app

COPY api-shared-config.json /app/api-shared-config.json
COPY dart_back_end/catalog/pubspec.yaml dart_back_end/catalog/pubspec.lock* /app/dart_back_end/catalog/
WORKDIR /app/dart_back_end/catalog
RUN dart pub get

WORKDIR /app
COPY dart_back_end/catalog /app/dart_back_end/catalog

WORKDIR /app/dart_back_end/catalog
RUN dart pub get

EXPOSE 3003

CMD ["dart", "run", "bin/server.dart"]
