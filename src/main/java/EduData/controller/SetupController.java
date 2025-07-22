package EduData.controller;

import EduData.entity.Usuario;
import EduData.repository.UsuarioRepository;
import EduData.service.DataInitializationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SetupController {

    private final UsuarioRepository usuarioRepository;
    private final DataInitializationService dataInitializationService;

    @PostMapping("/init-users")
    public ResponseEntity<Map<String, Object>> initializeUsers() {
        try {
            // Ejecutar la inicialización manualmente
            dataInitializationService.run();
            
            List<Usuario> usuarios = usuarioRepository.findAll();
            usuarios.forEach(user -> user.setPassword(null)); // No mostrar contraseñas
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuarios inicializados correctamente");
            response.put("totalUsuarios", usuarios.size());
            response.put("usuarios", usuarios);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error al inicializar usuarios: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/check-users")
    public ResponseEntity<Map<String, Object>> checkUsers() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        usuarios.forEach(user -> user.setPassword(null)); // No mostrar contraseñas
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalUsuarios", usuarios.size());
        response.put("usuarios", usuarios);
        response.put("usernames", usuarios.stream().map(Usuario::getUsername).toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testConnection() {
        try {
            long count = usuarioRepository.count();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Conexión a base de datos OK");
            response.put("totalUsuarios", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error de conexión: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
