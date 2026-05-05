package com.humankind360.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final String issuer;
  private final int expiresMinutes;
  private final byte[] secretBytes;

  public JwtService(
      @Value("${app.jwt.issuer}") String issuer,
      @Value("${app.jwt.expiresMinutes}") int expiresMinutes,
      @Value("${app.jwt.secret}") String secret
  ) {
    this.issuer = issuer;
    this.expiresMinutes = expiresMinutes;
    this.secretBytes = secret.getBytes(StandardCharsets.UTF_8);
  }

  public String issue(String subject, Map<String, Object> claims) {
    var now = Instant.now();
    var exp = now.plus(expiresMinutes, ChronoUnit.MINUTES);
    return Jwts.builder()
        .issuer(issuer)
        .subject(subject)
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .claims(claims)
        .signWith(Keys.hmacShaKeyFor(secretBytes))
        .compact();
  }

  public JwtUser parse(String token) {
    var jwt = Jwts.parser()
        .verifyWith(Keys.hmacShaKeyFor(secretBytes))
        .build()
        .parseSignedClaims(token);

    var claims = jwt.getPayload();
    var sub = claims.getSubject();
    var email = (String) claims.get("email");
    var name = (String) claims.get("name");
    return new JwtUser(sub, email, name);
  }
}

