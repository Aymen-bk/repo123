package com.humankind360.backend.web;

import com.humankind360.backend.es.CompanyEsService;
import java.io.IOException;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
  private final CompanyEsService companies;

  public CompanyController(CompanyEsService companies) {
    this.companies = companies;
  }

  @GetMapping
  public ResponseEntity<List<CompanyListItem>> search(
      @RequestParam(name = "q", required = false) String q,
      @RequestParam(name = "industry", required = false) String industry,
      @RequestParam(name = "country", required = false) String country,
      @RequestParam(name = "minScore", defaultValue = "0") double minScore,
      @RequestParam(name = "maxScore", defaultValue = "100") double maxScore
  ) throws IOException, InterruptedException {
    companies.ensureIndex();
    return ResponseEntity.ok(companies.search(q, industry, country, minScore, maxScore));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Object> getById(@PathVariable("id") String id) throws IOException, InterruptedException {
    companies.ensureIndex();
    var doc = companies.getById(id);
    return doc.<ResponseEntity<Object>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping("/facets/industries")
  public ResponseEntity<List<String>> industries() throws IOException, InterruptedException {
    companies.ensureIndex();
    return ResponseEntity.ok(companies.listDistinct("industry"));
  }

  @GetMapping("/facets/countries")
  public ResponseEntity<List<String>> countries() throws IOException, InterruptedException {
    companies.ensureIndex();
    return ResponseEntity.ok(companies.listDistinct("country"));
  }
}

