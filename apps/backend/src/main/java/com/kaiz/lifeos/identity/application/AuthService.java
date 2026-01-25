package com.kaiz.lifeos.identity.application;

import com.kaiz.lifeos.identity.application.dto.AuthDtos.AuthResponse;
import com.kaiz.lifeos.identity.application.dto.AuthDtos.LoginRequest;
import com.kaiz.lifeos.identity.application.dto.AuthDtos.RefreshTokenRequest;
import com.kaiz.lifeos.identity.application.dto.AuthDtos.RegisterRequest;
import com.kaiz.lifeos.identity.application.dto.AuthDtos.TokenResponse;
import com.kaiz.lifeos.identity.application.dto.AuthDtos.UserResponse;
import com.kaiz.lifeos.identity.domain.RefreshToken;
import com.kaiz.lifeos.identity.domain.User;
import com.kaiz.lifeos.identity.infrastructure.RefreshTokenRepository;
import com.kaiz.lifeos.identity.infrastructure.UserRepository;
import com.kaiz.lifeos.shared.config.JwtProperties;
import com.kaiz.lifeos.shared.exception.BadRequestException;
import com.kaiz.lifeos.shared.exception.ResourceNotFoundException;
import com.kaiz.lifeos.shared.exception.UnauthorizedException;
import com.kaiz.lifeos.shared.security.JwtTokenProvider;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;
  private final JwtProperties jwtProperties;
  private final UserMapper userMapper;

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new BadRequestException("EMAIL_EXISTS", "Email already registered");
    }

    User user =
        User.builder()
            .email(request.email().toLowerCase().trim())
            .passwordHash(passwordEncoder.encode(request.password()))
            .fullName(request.fullName().trim())
            .timezone(request.timezone() != null ? request.timezone() : "UTC")
            .build();

    user = userRepository.save(user);
    log.info("User registered: {}", user.getEmail());

    return createAuthResponse(user);
  }

  @Transactional
  public AuthResponse login(LoginRequest request) {
    User user =
        userRepository
            .findByEmail(request.email().toLowerCase().trim())
            .orElseThrow(
                () ->
                    new UnauthorizedException("INVALID_CREDENTIALS", "Invalid email or password"));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new UnauthorizedException("INVALID_CREDENTIALS", "Invalid email or password");
    }

    log.info("User logged in: {}", user.getEmail());
    return createAuthResponse(user);
  }

  @Transactional
  public TokenResponse refreshToken(RefreshTokenRequest request) {
    String tokenHash = hashToken(request.refreshToken());

    RefreshToken storedToken =
        refreshTokenRepository
            .findByTokenHash(tokenHash)
            .orElseThrow(() -> new UnauthorizedException("INVALID_TOKEN", "Invalid refresh token"));

    if (!storedToken.isValid()) {
      throw new UnauthorizedException("TOKEN_EXPIRED", "Refresh token expired or revoked");
    }

    // Validate the JWT
    if (!jwtTokenProvider.validateToken(request.refreshToken())
        || !jwtTokenProvider.isRefreshToken(request.refreshToken())) {
      throw new UnauthorizedException("INVALID_TOKEN", "Invalid refresh token");
    }

    // Revoke old token (rotation)
    storedToken.revoke();
    refreshTokenRepository.save(storedToken);

    // Generate new tokens
    User user = storedToken.getUser();
    String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
    String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

    // Store new refresh token
    saveRefreshToken(user, newRefreshToken);

    log.debug("Tokens refreshed for user: {}", user.getEmail());
    return new TokenResponse(newAccessToken, newRefreshToken);
  }

  @Transactional
  public void logout(UUID userId) {
    refreshTokenRepository.revokeAllByUserId(userId, Instant.now());
    log.info("User logged out: {}", userId);
  }

  @Transactional(readOnly = true)
  public UserResponse getCurrentUser(UUID userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

    return userMapper.toUserResponse(user);
  }

  private AuthResponse createAuthResponse(User user) {
    String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
    String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

    saveRefreshToken(user, refreshToken);

    UserResponse userResponse = userMapper.toUserResponse(user);
    return new AuthResponse(accessToken, refreshToken, userResponse);
  }

  private void saveRefreshToken(User user, String token) {
    RefreshToken refreshToken =
        RefreshToken.builder()
            .user(user)
            .tokenHash(hashToken(token))
            .expiresAt(Instant.now().plusMillis(jwtProperties.refreshTokenExpiration()))
            .build();

    refreshTokenRepository.save(refreshToken);
  }

  private String hashToken(String token) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
      return Base64.getEncoder().encodeToString(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("SHA-256 not available", e);
    }
  }
}
