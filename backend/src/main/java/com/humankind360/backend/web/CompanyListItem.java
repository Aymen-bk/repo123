package com.humankind360.backend.web;

import com.fasterxml.jackson.databind.JsonNode;

public record CompanyListItem(
    String company_id,
    String company_name,
    String company_ticker,
    String country,
    String head_quarter_iso_2_code,
    String industry,
    Double global_score
) {
  public static CompanyListItem fromSource(JsonNode src) {
    var hr = src.path("humankind_response");
    var gs = hr.path("global_score");
    Double globalScore = gs.isMissingNode() || gs.isNull() ? null : gs.asDouble();
    return new CompanyListItem(
        src.path("company_id").asText(),
        src.path("company_name").asText(),
        src.path("company_ticker").asText(),
        src.path("country").asText(),
        src.path("head_quarter_iso_2_code").asText(),
        src.path("industry").asText(),
        globalScore
    );
  }
}

