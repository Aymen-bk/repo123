package com.humankind360.backend.es;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.humankind360.backend.web.CompanyListItem;
import java.io.IOException;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CompanyEsService {
  private final EsClient es;
  private final ObjectMapper mapper;
  private final String index;
  private final Map<String, JsonNode> fallbackStore = new ConcurrentHashMap<>();
  private volatile boolean esAvailable = true;

  public CompanyEsService(EsClient es, ObjectMapper mapper, @Value("${elasticsearch.index}") String index) {
    this.es = es;
    this.mapper = mapper;
    this.index = index;
  }

  public void ensureIndex() throws IOException, InterruptedException {
    if (!esAvailable) return;
    try {
      es.get("/" + index);
    } catch (IOException e) {
      if (looksLikeEsDown(e)) {
        esAvailable = false;
        return;
      }
      var body = mapper.createObjectNode();
      var settings = body.putObject("settings");
      settings.put("number_of_shards", 1);
      settings.put("number_of_replicas", 0);

      var mappings = body.putObject("mappings");
      var props = mappings.putObject("properties");
      props.putObject("company_id").put("type", "keyword");
      props.putObject("company_name").put("type", "text");
      props.putObject("company_ticker").put("type", "keyword");
      props.putObject("country").put("type", "keyword");
      props.putObject("industry").put("type", "keyword");
      props.putObject("humankind_response").putObject("properties")
          .putObject("global_score").put("type", "double");

      es.putJson("/" + index, body);
    }
  }

  public String upsertCompanyDoc(JsonNode companyDoc) throws IOException, InterruptedException {
    var idNode = companyDoc.get("company_id");
    if (idNode == null || idNode.asText().isBlank()) throw new IllegalArgumentException("Missing company_id");
    var id = idNode.asText();
    if (esAvailable) {
      try {
        es.putJson("/" + index + "/_doc/" + encodeId(id), companyDoc);
      } catch (IOException e) {
        if (looksLikeEsDown(e)) {
          esAvailable = false;
          fallbackStore.put(id, companyDoc);
        } else {
          throw e;
        }
      }
    } else {
      fallbackStore.put(id, companyDoc);
    }
    return id;
  }

  public Optional<JsonNode> getById(String id) throws IOException, InterruptedException {
    if (!esAvailable) return Optional.ofNullable(fallbackStore.get(id));
    try {
      var res = es.get("/" + index + "/_doc/" + encodeId(id));
      var source = res.get("_source");
      return Optional.ofNullable(source);
    } catch (IOException e) {
      if (looksLikeEsDown(e)) {
        esAvailable = false;
        return Optional.ofNullable(fallbackStore.get(id));
      }
      if (e.getMessage() != null && e.getMessage().contains("\"found\":false")) return Optional.empty();
      return Optional.empty();
    }
  }

  public List<CompanyListItem> search(String q, String industry, String country, double minScore, double maxScore)
      throws IOException, InterruptedException {
    if (!esAvailable) return searchFallback(q, industry, country, minScore, maxScore);
    var body = mapper.createObjectNode();
    body.put("size", 200);

    var query = body.putObject("query").putObject("bool");
    var must = query.putArray("must");
    var filter = query.putArray("filter");

    if (q != null && !q.isBlank()) {
      var multi = mapper.createObjectNode();
      var mm = multi.putObject("multi_match");
      mm.put("query", q);
      mm.putArray("fields").add("company_name").add("company_ticker");
      must.add(multi);
    } else {
      must.add(mapper.createObjectNode().putObject("match_all"));
    }

    if (industry != null && !industry.isBlank()) {
      filter.add(term("industry", industry));
    }
    if (country != null && !country.isBlank()) {
      filter.add(term("country", country));
    }
    filter.add(range("humankind_response.global_score", minScore, maxScore));

    JsonNode res;
    try {
      res = es.postJson("/" + index + "/_search", body);
    } catch (IOException e) {
      if (looksLikeEsDown(e)) {
        esAvailable = false;
        return searchFallback(q, industry, country, minScore, maxScore);
      }
      throw e;
    }
    var hits = res.path("hits").path("hits");
    if (!hits.isArray()) return List.of();

    var out = new ArrayList<CompanyListItem>();
    for (var hit : hits) {
      var src = hit.path("_source");
      if (src.isMissingNode()) continue;
      out.add(CompanyListItem.fromSource(src));
    }
    return out;
  }

  public List<String> listDistinct(String field) throws IOException, InterruptedException {
    if (!esAvailable) return distinctFallback(field);
    var body = mapper.createObjectNode();
    body.put("size", 0);
    var aggs = body.putObject("aggs");
    aggs.putObject("distinct").putObject("terms").put("field", field).put("size", 200);
    body.putObject("query").putObject("match_all");
    JsonNode res;
    try {
      res = es.postJson("/" + index + "/_search", body);
    } catch (IOException e) {
      if (looksLikeEsDown(e)) {
        esAvailable = false;
        return distinctFallback(field);
      }
      throw e;
    }
    var buckets = res.path("aggregations").path("distinct").path("buckets");
    if (!buckets.isArray()) return List.of();
    var out = new ArrayList<String>();
    for (var b : buckets) out.add(b.path("key").asText());
    return out;
  }

  private ObjectNode term(String field, String value) {
    var t = mapper.createObjectNode();
    t.putObject("term").put(field, value);
    return t;
  }

  private ObjectNode range(String field, double gte, double lte) {
    var r = mapper.createObjectNode();
    r.putObject("range").putObject(field).put("gte", gte).put("lte", lte);
    return r;
  }

  private String encodeId(String id) {
    return id.replaceAll(" ", "%20");
  }

  private boolean looksLikeEsDown(IOException e) {
    var cause = e.getCause();
    if (cause instanceof java.net.ConnectException) return true;
    if (cause instanceof java.net.http.HttpConnectTimeoutException) return true;
    var msg = e.getMessage();
    if (msg == null) return true;
    var m = msg.toLowerCase();
    return m.contains("connection") || m.contains("connect") || m.contains("refused") || m.contains("timed out");
  }

  private List<CompanyListItem> searchFallback(String q, String industry, String country, double minScore, double maxScore) {
    var query = q == null ? "" : q.toLowerCase();
    var out = new ArrayList<CompanyListItem>();
    for (var entry : fallbackStore.entrySet()) {
      var src = entry.getValue();
      var name = src.path("company_name").asText("");
      var ticker = src.path("company_ticker").asText("");
      var ind = src.path("industry").asText("");
      var ctry = src.path("country").asText("");
      var score = src.path("humankind_response").path("global_score").asDouble(0);

      var matchQ = query.isBlank() || name.toLowerCase().contains(query) || ticker.toLowerCase().contains(query);
      var matchI = industry == null || industry.isBlank() || ind.equals(industry);
      var matchC = country == null || country.isBlank() || ctry.equals(country);
      var matchS = score >= minScore && score <= maxScore;

      if (matchQ && matchI && matchC && matchS) out.add(CompanyListItem.fromSource(src));
    }
    return out;
  }

  private List<String> distinctFallback(String field) {
    Set<String> out = new HashSet<>();
    for (var src : fallbackStore.values()) {
      out.add(src.path(field).asText(""));
    }
    out.remove("");
    return out.stream().sorted().toList();
  }
}

