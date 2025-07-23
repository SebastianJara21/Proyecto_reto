package EduData.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;


@Service
public class NlqService {

    @Value("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")
    private String apiKey;

    private final EntityManager entityManager;
    private final ObjectMapper objectMapper;

    public NlqService(EntityManager entityManager) {
        this.entityManager = entityManager;
        this.objectMapper = new ObjectMapper(); // para leer JSON manualmente
    }

    public List<Map<String, Object>> answer(String pregunta) {
        System.out.println("=== INICIANDO CONSULTA NLQ ===");
        System.out.println("Pregunta recibida: " + pregunta);
        
        // Prompt dirigido a generar JPQL
        String promptTemplate = """
            Eres un asistente que transforma preguntas en lenguaje natural a JPQL (Java Persistence Query Language).
            Usa las siguientes entidades del sistema educativo:

            Entidad 'Estudiante':
            - id (Long)
            - identificacion (String)
            - nombre (String)
            - apellido (String)
            - correo (String)
            - fechaNacimiento (LocalDate)
            - genero (String)
            - telefono (String)
            - direccion (String)
            - matriculaAnio (Integer)
            - estado (String)
            - nivel (String)
            - grupo (String)

            Entidad 'Curso':
            - id (Long)
            - nombre (String)
            - codigo (String)
            - descripcion (String)
            - anio (Integer)
            - docente (Docente)

            Entidad 'Matricula':
            - id (Long)
            - anio (Integer)
            - estudiante (Estudiante)
            - curso (Curso)

            Entidad 'Docente':
            - id (Long)
            - nombre (String)
            - email (String)
            - especialidad (String)

            REGLAS IMPORTANTES:
            1. Usa valores literales en lugar de parámetros nombrados
            2. Para strings, usa comillas simples: 'valor'
            3. Para números, usa valores directos: 2024
            4. Para LIKE, usa el formato: LIKE '%texto%'

            Ejemplos de consultas:
            - "cuántos estudiantes hay" -> SELECT COUNT(e) FROM Estudiante e
            - "estudiantes del 2024" -> SELECT e FROM Estudiante e WHERE e.matriculaAnio = 2024
            - "estudiantes de género masculino" -> SELECT e FROM Estudiante e WHERE e.genero = 'Masculino'
            - "cursos de matemáticas" -> SELECT c FROM Curso c WHERE c.nombre LIKE '%matemática%'
            - "estudiante llamado Juan" -> SELECT e FROM Estudiante e WHERE e.nombre LIKE '%Juan%'
            - "docentes de informática" -> SELECT d FROM Docente d WHERE d.especialidad LIKE '%informática%'

            Devuelve solo la consulta JPQL válida, sin explicación ni formato adicional.

            Pregunta: """;
        
        String prompt = promptTemplate + pregunta;
        
        System.out.println("Prompt generado correctamente");

        try {
            System.out.println("=== LLAMANDO A OPENROUTER ===");
            
            if (apiKey == null || apiKey.trim().isEmpty()) {
                System.err.println("ERROR: API Key no configurada");
                return List.of(Map.of("error", "API Key de OpenRouter no configurada"));
            }
            
            System.out.println("API Key configurada: " + apiKey.substring(0, 10) + "...");

            WebClient client = WebClient.builder()
                    .baseUrl("https://openrouter.ai")
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();

            System.out.println("WebClient configurado");

            // Escapar el prompt para JSON
            String escapedPrompt = prompt.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
            
            String requestBody = "{" +
                    "\"model\": \"openai/gpt-4o\"," +
                    "\"messages\": [" +
                    "{\"role\": \"user\", \"content\": \"" + escapedPrompt + "\"}" +
                    "]," +
                    "\"max_tokens\": 1000" +
                    "}";

            System.out.println("Request body preparado");

            String responseJson = client.post()
                    .uri("/api/v1/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            response -> {
                                return response.bodyToMono(String.class)
                                        .flatMap(errorBody -> {
                                            System.err.println("=== ERROR DEL SERVIDOR OPENROUTER ===");
                                            System.err.println("Status: " + response.statusCode());
                                            System.err.println("Body: " + errorBody);
                                            return Mono.error(new RuntimeException("Error al llamar a OpenRouter: " + errorBody));
                                        });
                            })
                    .bodyToMono(String.class)
                    .block();

            System.out.println("=== RESPUESTA DE OPENROUTER RECIBIDA ===");
            System.out.println("Response JSON: " + responseJson);

            // Parsear manualmente la respuesta
            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) objectMapper.readValue(responseJson, Map.class);
            @SuppressWarnings("unchecked")
            List<Map<?, ?>> choices = (List<Map<?, ?>>) response.get("choices");
            Map<?, ?> choice = choices.get(0);
            Map<?, ?> message = (Map<?, ?>) choice.get("message");
            String jpql = message.get("content").toString().trim();

            System.out.println("=== JPQL GENERADO POR LA IA ===");
            System.out.println("JPQL: " + jpql);

            // Ejecutar JPQL
            try {
                System.out.println("=== EJECUTANDO JPQL ===");
                
                // Verificar si la consulta tiene parámetros nombrados sin resolver
                if (jpql.contains(":") && jpql.matches(".*:[a-zA-Z][a-zA-Z0-9]*.*")) {
                    System.err.println("ERROR: La consulta contiene parámetros nombrados sin resolver");
                    return List.of(Map.of(
                            "error", "La consulta generada contiene parámetros no resueltos. Intenta reformular tu pregunta con más contexto.",
                            "jpql", jpql,
                            "sugerencia", "Ejemplo: En lugar de preguntar '¿cómo se llama el estudiante?' pregunta '¿cuántos estudiantes hay?' o 'estudiantes del año 2024'"
                    ));
                }
                
                Query query = entityManager.createQuery(jpql);
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> resultados = (List<Map<String, Object>>) query.getResultList();
                System.out.println("Resultados obtenidos: " + resultados.size() + " registros");
                return resultados;
            } catch (Exception e) {
                System.err.println("=== ERROR EJECUTANDO JPQL ===");
                System.err.println("Error: " + e.getMessage());
                e.printStackTrace();
                
                // Devuelve el error y el JPQL generado para depuración
                return List.of(Map.of(
                        "error", "Error ejecutando consulta: " + e.getMessage(),
                        "jpql", jpql,
                        "sugerencia", "Intenta hacer una pregunta más específica como '¿cuántos estudiantes hay?' o 'estudiantes del año 2024'"
                ));
            }

        } catch (Exception e) {
            System.err.println("=== ERROR GENERAL ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            return List.of(Map.of(
                    "error", "Error en el servicio: " + e.getMessage()
            ));
        }
    }
}

