package com.music.backend.controller;

import com.music.backend.dto.AuthResponse;
import com.music.backend.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request.email(), request.password());
  }

  @PostMapping("/signup")
  public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
    return authService.signup(request.email(), request.password());
  }

  public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

  public record SignupRequest(@NotBlank @Email String email, @NotBlank String password) {}
}
