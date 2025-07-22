package EduData.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import EduData.service.NlqServiceMejorado;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nlq")
public class NlqControlador {
    private final NlqServiceMejorado service;

    public NlqControlador(NlqServiceMejorado service){
        this.service = service;
    }

    @PostMapping(
            path= "/pregunta",
            consumes = MediaType.TEXT_PLAIN_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Map<String, Object>> consulta (@RequestBody String pregunta){
        return service.answer(pregunta);
    }
    
    @GetMapping("/test")
    public Map<String, Object> test() {
        return Map.of(
                "status", "OK",
                "message", "El servicio NLQ mejorado está funcionando",
                "timestamp", System.currentTimeMillis(),
                "version", "2.0"
        );
    }
}