package EduData.service;

import EduData.entity.Usuario;
import EduData.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }

    private void initializeDefaultUsers() {
        // Usuario Administrador
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = Usuario.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@edudata.com")
                    .nombre("Administrador")
                    .apellido("Sistema")
                    .role(Usuario.Role.ADMIN)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            usuarioRepository.save(admin);
            log.info("Usuario administrador creado: admin/admin123");
        }

        // Usuario Docente
        if (!usuarioRepository.existsByUsername("docente")) {
            Usuario docente = Usuario.builder()
                    .username("docente")
                    .password(passwordEncoder.encode("docente123"))
                    .email("docente@edudata.com")
                    .nombre("María")
                    .apellido("García")
                    .role(Usuario.Role.DOCENTE)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            usuarioRepository.save(docente);
            log.info("Usuario docente creado: docente/docente123");
        }

        // Usuario Estudiante
        if (!usuarioRepository.existsByUsername("estudiante")) {
            Usuario estudiante = Usuario.builder()
                    .username("estudiante")
                    .password(passwordEncoder.encode("estudiante123"))
                    .email("estudiante@edudata.com")
                    .nombre("Carlos")
                    .apellido("López")
                    .role(Usuario.Role.ESTUDIANTE)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            usuarioRepository.save(estudiante);
            log.info("Usuario estudiante creado: estudiante/estudiante123");
        }

        // Usuario Invitado (se crea automáticamente en AuthService, pero lo creamos aquí también)
        if (!usuarioRepository.existsByUsername("invitado")) {
            Usuario invitado = Usuario.builder()
                    .username("invitado")
                    .password(passwordEncoder.encode("guest123"))
                    .email("invitado@edudata.com")
                    .nombre("Usuario")
                    .apellido("Invitado")
                    .role(Usuario.Role.INVITADO)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            usuarioRepository.save(invitado);
            log.info("Usuario invitado creado: invitado/guest123");
        }

        log.info("=== USUARIOS DISPONIBLES ===");
        log.info("Admin: admin/admin123");
        log.info("Docente: docente/docente123");
        log.info("Estudiante: estudiante/estudiante123");
        log.info("Invitado: invitado/guest123 (o usar botón 'Entrar como Invitado')");
        log.info("============================");
    }
}
