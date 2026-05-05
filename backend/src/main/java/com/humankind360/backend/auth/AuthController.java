package com.humankind360.backend.auth;

import com.humankind360.backend.security.JwtService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
  private final JwtService jwtService;
  private final JavaMailSender mailSender;
  private final ConcurrentHashMap<String, String> otpStore = new ConcurrentHashMap<>();
  private final long otpExpiryMillis;

  public AuthController(JwtService jwtService, JavaMailSender mailSender, @Value("${app.otp.expiryMillis}") long otpExpiryMillis) {
    this.jwtService = jwtService;
    this.mailSender = mailSender;
    this.otpExpiryMillis = otpExpiryMillis;
  }

  public record MockGoogleLoginRequest(
      @NotBlank @Email String email,
      @NotBlank String name
  ) {}

  public record UserDto(String userId, String email, String name) {}
  public record AuthResponse(String token, UserDto user) {}

  public record OtpRequest(@NotBlank @Email String email) {}
  public record OtpVerifyRequest(@NotBlank @Email String email, @NotBlank String otp) {}

  @PostMapping("/mock-google")
  public ResponseEntity<AuthResponse> mockGoogle(@RequestBody MockGoogleLoginRequest req) {
    var userId = UUID.nameUUIDFromBytes(req.email().toLowerCase().getBytes()).toString();
    var token = jwtService.issue(
        userId,
        Map.of("email", req.email(), "name", req.name())
    );
    return ResponseEntity.ok(new AuthResponse(token, new UserDto(userId, req.email(), req.name())));
  }

  @PostMapping("/otp/request")
  public ResponseEntity<Void> requestOtp(@RequestBody OtpRequest req) {
    String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
    otpStore.put(req.email(), otp);
    MimeMessagePreparator message = mimeMessage -> {
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
      helper.setTo(req.email());
      helper.setSubject("Your OTP Code");
      helper.setText("Your OTP is: " + otp);
    };
    mailSender.send(message);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/otp/verify")
  public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerifyRequest req) {
    String storedOtp = otpStore.get(req.email());
    if (storedOtp != null && storedOtp.equals(req.otp())) {
      otpStore.remove(req.email());
      String token = jwtService.issue(req.email(), Map.of("email", req.email()));
      return ResponseEntity.ok(new AuthResponse(token, new UserDto(req.email(), req.email(), "")));
    }
    return ResponseEntity.status(401).build();
  }
}

