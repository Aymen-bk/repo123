package com.humankind360.backend.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.humankind360.backend.es.CompanyEsService;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {
  private final CompanyEsService companies;
  private final ObjectMapper mapper;

  public ImportController(CompanyEsService companies, ObjectMapper mapper) {
    this.companies = companies;
    this.mapper = mapper;
  }

  public record ImportResponse(int importedCount, List<String> ids) {}

  @PostMapping(
      value = "/companies",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public ResponseEntity<ImportResponse> importCompaniesMultipart(@RequestPart("file") MultipartFile file)
      throws IOException, InterruptedException {
    var json = new String(file.getBytes(), StandardCharsets.UTF_8);
    return ResponseEntity.ok(importCompaniesFromJson(json));
  }

  @PostMapping(
      value = "/companies",
      consumes = MediaType.APPLICATION_JSON_VALUE
  )
  public ResponseEntity<ImportResponse> importCompaniesJson(@RequestBody String body)
      throws IOException, InterruptedException {
    return ResponseEntity.ok(importCompaniesFromJson(body));
  }

  private ImportResponse importCompaniesFromJson(String json) throws IOException, InterruptedException {
    companies.ensureIndex();
    JsonNode node = mapper.readTree(json);

    var ids = new ArrayList<String>();
    if (node.isArray()) {
      for (var item : node) ids.add(companies.upsertCompanyDoc(item));
    } else {
      ids.add(companies.upsertCompanyDoc(node));
    }
    return new ImportResponse(ids.size(), ids);
  }
}

