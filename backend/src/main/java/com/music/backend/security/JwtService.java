package com.music.backend.security;

import com.music.backend.config.AppProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final AppProperties properties;

  public JwtService(AppProperties properties) {
    this.properties = properties;
  }

  public String generateToken(String subject) {
    var key = Keys.hmacShaKeyFor(properties.jwt().secret().getBytes(StandardCharsets.UTF_8));
    var expiry = Instant.now().plusSeconds(properties.jwt().expirationMinutes() * 60);
    return Jwts.builder()
        .subject(subject)
        .claims(Map.of("role", "USER"))
        .issuedAt(new Date())
        .expiration(Date.from(expiry))
        .signWith(key)
        .compact();
  }
}
