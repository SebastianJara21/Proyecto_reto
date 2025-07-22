package EduData.service;

import EduData.dto.LoginRequest;
import EduData.dto.LoginResponse;
import EduData.dto.RegisterRequest;
import EduData.entity.Usuario;
import EduData.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        var user = Usuario.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .role(Usuario.Role.valueOf(request.getRole().toUpperCase()))
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        usuarioRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        
        return new LoginResponse(
                jwtToken,
                "Bearer",
                user.getUsername(),
                user.getRole().name(),
                3600000L
        );
    }

    public LoginResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        
        var user = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar último login
        user.setLastLogin(LocalDateTime.now());
        usuarioRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return new LoginResponse(
                jwtToken,
                "Bearer",
                user.getUsername(),
                user.getRole().name(),
                3600000L
        );
    }

    public LoginResponse loginAsGuest() {
        // Crear usuario invitado temporal o usar uno existente
        var guestUser = usuarioRepository.findByUsername("invitado")
                .orElseGet(() -> {
                    var newGuest = Usuario.builder()
                            .username("invitado")
                            .password(passwordEncoder.encode("guest123"))
                            .email("invitado@edudata.com")
                            .nombre("Usuario")
                            .apellido("Invitado")
                            .role(Usuario.Role.INVITADO)
                            .enabled(true)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return usuarioRepository.save(newGuest);
                });

        guestUser.setLastLogin(LocalDateTime.now());
        usuarioRepository.save(guestUser);

        var jwtToken = jwtService.generateToken(guestUser);
        return new LoginResponse(
                jwtToken,
                "Bearer",
                guestUser.getUsername(),
                guestUser.getRole().name(),
                3600000L
        );
    }
}
