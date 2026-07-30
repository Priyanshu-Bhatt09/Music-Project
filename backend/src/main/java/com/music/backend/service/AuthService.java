package com.music.backend.service;

import com.music.backend.dto.AuthResponse;
import com.music.backend.entity.UserAccount;
import com.music.backend.exception.ApiException;
import com.music.backend.repository.UserAccountRepository;
import com.music.backend.security.JwtService;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthService {
  private final UserAccountRepository users;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserAccountRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse signup(String email, String password) {
    var normalizedEmail = normalizeEmail(email);
    if (users.existsByEmailIgnoreCase(normalizedEmail)) {
      throw new ApiException(HttpStatus.CONFLICT, "Account already exists. Please sign in.");
    }

    var account = new UserAccount();
    account.setEmail(normalizedEmail);
    account.setPasswordHash(passwordEncoder.encode(password));
    users.save(account);

    return new AuthResponse(jwtService.generateToken(normalizedEmail), normalizedEmail);
  }

  public AuthResponse login(String email, String password) {
    var normalizedEmail = normalizeEmail(email);
    var account = users.findByEmailIgnoreCase(normalizedEmail)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Account doesn't exist. Please signup."));

    if (!passwordEncoder.matches(password, account.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Incorrect password.");
    }

    return new AuthResponse(jwtService.generateToken(account.getEmail()), account.getEmail());
  }

  private String normalizeEmail(String email) {
    if (!StringUtils.hasText(email)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Email is required.");
    }
    return email.trim().toLowerCase(Locale.ROOT);
  }
}
