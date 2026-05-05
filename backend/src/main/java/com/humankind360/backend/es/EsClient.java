package com.humankind360.backend.es;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EsClient {
  private final HttpClient http;
  private final ObjectMapper mapper;
  private final String baseUrl;

  public EsClient(ObjectMapper mapper, @Value("${elasticsearch.baseUrl}") String baseUrl) {
    this.http = HttpClient.newHttpClient();
    this.mapper = mapper;
    this.baseUrl = baseUrl.replaceAll("/+$", "");
  }

  public JsonNode get(String path) throws IOException, InterruptedException {
    var req = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + path))
        .GET()
        .build();
    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    if (res.statusCode() >= 300) throw new IOException("ES GET failed: " + res.statusCode() + " " + res.body());
    return mapper.readTree(res.body());
  }

  public JsonNode putJson(String path, JsonNode body) throws IOException, InterruptedException {
    var req = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + path))
        .header("Content-Type", "application/json")
        .PUT(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
        .build();
    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    if (res.statusCode() >= 300) throw new IOException("ES PUT failed: " + res.statusCode() + " " + res.body());
    return mapper.readTree(res.body());
  }

  public JsonNode postJson(String path, JsonNode body) throws IOException, InterruptedException {
    var req = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + path))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
        .build();
    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    if (res.statusCode() >= 300) throw new IOException("ES POST failed: " + res.statusCode() + " " + res.body());
    return mapper.readTree(res.body());
  }
}

