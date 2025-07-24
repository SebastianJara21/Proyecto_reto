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

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NlqServiceMejorado {

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    @Value("${server.url:https://edudata-backend.onrender.com}")
    private String serverUrl;
    
    // Backup: intentar leer directamente del environment
    @org.springframework.beans.factory.annotation.Value("#{systemEnvironment['OPENAI_API_KEY'] ?: '${spring.ai.openai.api-key:}'}")
    private String backupApiKey;

    private final EntityManager entityManager;
    private final ObjectMapper objectMapper;

    public NlqServiceMejorado(EntityManager entityManager) {
        this.entityManager = entityManager;
        this.objectMapper = new ObjectMapper();
        
        // Debug: Verificar que la API key se esté inyectando correctamente
        System.out.println("=== INICIALIZANDO NlqServiceMejorado ===");
    }
    
    // Método para debug - será llamado después de la inicialización
    @jakarta.annotation.PostConstruct
    private void debugApiKey() {
        System.out.println("=== POST-CONSTRUCT DEBUG ===");
        System.out.println("API Key después de inicialización - Existe: " + (apiKey != null));
        System.out.println("API Key después de inicialización - No vacía: " + (apiKey != null && !apiKey.trim().isEmpty()));
        System.out.println("Backup API Key - Existe: " + (backupApiKey != null));
        System.out.println("Backup API Key - No vacía: " + (backupApiKey != null && !backupApiKey.trim().isEmpty()));
        
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            System.out.println("API Key (primeros 15 chars): " + apiKey.substring(0, Math.min(15, apiKey.length())) + "...");
        }
        if (backupApiKey != null && !backupApiKey.trim().isEmpty()) {
            System.out.println("Backup API Key (primeros 15 chars): " + backupApiKey.substring(0, Math.min(15, backupApiKey.length())) + "...");
        }
    }

    public List<Map<String, Object>> answer(String pregunta) {
        System.out.println("=== INICIANDO CONSULTA NLQ MEJORADA ===");
        System.out.println("Pregunta recibida: " + pregunta);
        
        // Detectar si la pregunta necesita parámetros y extraerlos
        Map<String, String> parametros = extraerParametros(pregunta);
        System.out.println("Parámetros extraídos: " + parametros);
        
        String promptTemplate = """
            Eres un asistente experto que transforma preguntas en lenguaje natural a JPQL.
            
            ENTIDADES DISPONIBLES:
            
            Estudiante: id, identificacion, nombre, apellido, correo, fechaNacimiento, genero, telefono, direccion, matriculaAnio, estado, nivel, grupo
            
            Docente: id, nombre, email, especialidad
            
            Curso: id, nombre, codigo, descripcion, anio, docente (relación con Docente)
            
            Matricula: id, anio, estudiante (relación con Estudiante), curso (relación con Curso)
            
            REGLAS IMPORTANTES:
            1. USA SIEMPRE valores literales, NUNCA parámetros como :nombre
            2. Para strings, usa comillas simples: 'valor'
            3. Para LIKE, usa: LIKE '%texto%' 
            4. Para números, usa valores directos: 2024
            5. Para fechas, usa formato: '2024-01-01'
            6. Si necesitas mostrar datos relacionados, usa JOIN
            
            EJEMPLOS DE CONSULTAS CORRECTAS:
            - "cuántos estudiantes hay" → SELECT COUNT(e) FROM Estudiante e
            - "estudiantes del 2024" → SELECT e FROM Estudiante e WHERE e.matriculaAnio = 2024
            - "estudiantes masculinos" → SELECT e FROM Estudiante e WHERE e.genero = 'Masculino'
            - "cursos de matemáticas" → SELECT c FROM Curso c WHERE c.nombre LIKE '%matemática%'
            - "estudiantes llamados juan" → SELECT e FROM Estudiante e WHERE e.nombre LIKE '%Juan%'
            - "docentes de informática" → SELECT d FROM Docente d WHERE d.especialidad LIKE '%informática%'
            - "notas de sebastian" → SELECT e FROM Estudiante e WHERE e.nombre LIKE '%Sebastian%'
            - "datos de sebastian figueroa" → SELECT e FROM Estudiante e WHERE e.nombre LIKE '%Sebastian%' AND e.apellido LIKE '%Figueroa%'
            - "matriculas del 2024" → SELECT m FROM Matricula m WHERE m.anio = 2024
            - "cursos con docente" → SELECT c FROM Curso c JOIN c.docente d
            - "matriculas de estudiantes del 2024" → SELECT m FROM Matricula m JOIN m.estudiante e WHERE e.matriculaAnio = 2024
            - "cursos que tiene sebastian" → SELECT c FROM Matricula m JOIN m.curso c JOIN m.estudiante e WHERE e.nombre LIKE '%Sebastian%'
            - "estudiantes en cursos de matemáticas" → SELECT e FROM Matricula m JOIN m.estudiante e JOIN m.curso c WHERE c.nombre LIKE '%matemática%'
            - "datos completos de sebastian" → SELECT e FROM Estudiante e WHERE e.nombre LIKE '%Sebastian%'
            - "ver la nota de sebastian" → SELECT m FROM Matricula m JOIN m.estudiante e WHERE e.nombre LIKE '%Sebastian%'
            - "informacion de estudiante sebastian" → SELECT e FROM Estudiante e WHERE e.nombre LIKE '%Sebastian%'
            
            IMPORTANTE: Devuelve SOLO la consulta JPQL, sin explicaciones.
            
            Pregunta: """;
        
        String prompt = promptTemplate + pregunta;
        
        System.out.println("Prompt generado correctamente");

        try {
            System.out.println("=== LLAMANDO A OPENROUTER ===");
            System.out.println("Server URL configurada: " + serverUrl);
            
            // Usar backup API key si la principal está vacía
            String effectiveApiKey = (apiKey != null && !apiKey.trim().isEmpty()) ? apiKey : backupApiKey;
            
            System.out.println("API Key verificación - Existe: " + (effectiveApiKey != null));
            System.out.println("API Key verificación - No vacía: " + (effectiveApiKey != null && !effectiveApiKey.trim().isEmpty()));
            
            if (effectiveApiKey == null || effectiveApiKey.trim().isEmpty()) {
                System.err.println("ERROR: API Key no configurada");
                return List.of(Map.of("error", "API Key de OpenRouter no configurada. Verifica application.properties"));
            }

            // Crear el cuerpo de la petición usando Map para evitar problemas de escape
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("role", "user");
            messageMap.put("content", prompt);
            
            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", "deepseek/deepseek-r1-0528:free");
            requestBodyMap.put("messages", List.of(messageMap));
            requestBodyMap.put("max_tokens", 1000);
            requestBodyMap.put("temperature", 0.1);
            
            String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);
            
            System.out.println("=== ENVIANDO PETICIÓN A OPENROUTER ===");
            System.out.println("Usando modelo: deepseek/deepseek-r1-0528:free");

            WebClient client = WebClient.builder()
                    .baseUrl("https://openrouter.ai")
                    .defaultHeader("Authorization", "Bearer " + effectiveApiKey)
                    .defaultHeader("Content-Type", "application/json")
                    .defaultHeader("HTTP-Referer", serverUrl)
                    .defaultHeader("X-Title", "EduData")
                    .build();

            String responseJson = client.post()
                    .uri("/api/v1/chat/completions")
                    .bodyValue(requestBodyJson)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            response -> {
                                System.err.println("=== ERROR HTTP DETECTADO ===");
                                System.err.println("Status: " + response.statusCode());
                                return response.bodyToMono(String.class)
                                        .doOnNext(errorBody -> {
                                            System.err.println("Error body: " + errorBody);
                                        })
                                        .flatMap(errorBody -> Mono.error(new RuntimeException("Error al llamar a OpenRouter: " + errorBody)));
                            })
                    .bodyToMono(String.class)
                    .block();

            System.out.println("=== RESPUESTA DE OPENROUTER RECIBIDA ===");

            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) objectMapper.readValue(responseJson, Map.class);
            @SuppressWarnings("unchecked")
            List<Map<?, ?>> choices = (List<Map<?, ?>>) response.get("choices");
            Map<?, ?> choice = choices.get(0);
            Map<?, ?> message = (Map<?, ?>) choice.get("message");
            String jpql = message.get("content").toString().trim();

            // Limpiar la respuesta de posibles marcadores de código
            jpql = jpql.replaceAll("```sql", "").replaceAll("```jpql", "").replaceAll("```", "").trim();

            System.out.println("=== JPQL GENERADO POR LA IA ===");
            System.out.println("JPQL: " + jpql);

            // Validar JPQL antes de ejecutar
            if (jpql.contains(":") && jpql.matches(".*:[a-zA-Z][a-zA-Z0-9]*.*")) {
                System.err.println("ERROR: La consulta contiene parámetros nombrados sin resolver");
                return List.of(Map.of(
                        "error", "La consulta generada contiene parámetros no resueltos.",
                        "jpql", jpql,
                        "sugerencia", "Intenta ser más específico. Ejemplo: 'estudiantes del año 2024' en lugar de 'estudiantes de un año específico'"
                ));
            }

            // Ejecutar JPQL
            return ejecutarConsulta(jpql);

        } catch (Exception e) {
            System.err.println("=== ERROR AL LLAMAR A OPENROUTER ===");
            System.err.println("Error: " + e.getMessage());
            
            // Usar sistema de respaldo
            String jpqlFallback = generarJpqlFallback(pregunta, parametros);
            
            if (jpqlFallback != null && !jpqlFallback.trim().isEmpty()) {
                System.out.println("� Usando consulta de respaldo: " + jpqlFallback);
                try {
                    return ejecutarConsulta(jpqlFallback);
                } catch (Exception ex) {
                    System.err.println("❌ Error ejecutando consulta de respaldo: " + ex.getMessage());
                }
            }
            
            return List.of(Map.of(
                "error", "Error en el servicio: " + e.getMessage(),
                "sugerencia", "Intenta con preguntas más simples como '¿cuántos estudiantes hay?' o 'estudiantes del 2024'"
            ));
        }
    }

    private List<Map<String, Object>> ejecutarConsulta(String jpql) {
        try {
            System.out.println("=== EJECUTANDO JPQL ===");
            Query query = entityManager.createQuery(jpql);
            List<?> resultados = query.getResultList();
            
            System.out.println("Resultados obtenidos: " + resultados.size() + " registros");
            
            // Convertir resultados a Maps para evitar problemas de serialización
            List<Map<String, Object>> resultadosConvertidos = new ArrayList<>();
            
            for (Object resultado : resultados) {
                Map<String, Object> item = convertirResultado(resultado);
                resultadosConvertidos.add(item);
            }
            
            return resultadosConvertidos;
            
        } catch (Exception e) {
            System.err.println("=== ERROR EJECUTANDO JPQL ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            return List.of(Map.of(
                    "error", "Error ejecutando consulta: " + e.getMessage(),
                    "jpql", jpql,
                    "sugerencia", "Verifica que la consulta sea válida. Ejemplos que funcionan: 'cuántos estudiantes hay', 'estudiantes del 2024'"
            ));
        }
    }

    private Map<String, Object> convertirResultado(Object resultado) {
        Map<String, Object> item = new HashMap<>();
        
        if (resultado instanceof Number) {
            // Para consultas COUNT, SUM, etc.
            return Map.of("resultado", resultado);
        } else if (resultado instanceof String) {
            // Para consultas SELECT campo
            return Map.of("valor", resultado);
        } else if (resultado.getClass().getSimpleName().equals("Estudiante")) {
            // Convertir Estudiante a Map
            try {
                var estudiante = resultado;
                item.put("id", getFieldValue(estudiante, "id"));
                item.put("identificacion", getFieldValue(estudiante, "identificacion"));
                item.put("nombre", getFieldValue(estudiante, "nombre"));
                item.put("apellido", getFieldValue(estudiante, "apellido"));
                item.put("correo", getFieldValue(estudiante, "correo"));
                item.put("genero", getFieldValue(estudiante, "genero"));
                item.put("matriculaAnio", getFieldValue(estudiante, "matriculaAnio"));
                item.put("estado", getFieldValue(estudiante, "estado"));
            } catch (Exception e) {
                item.put("error", "Error convirtiendo estudiante: " + e.getMessage());
            }
        } else if (resultado.getClass().getSimpleName().equals("Docente")) {
            // Convertir Docente a Map
            try {
                var docente = resultado;
                item.put("id", getFieldValue(docente, "id"));
                item.put("nombre", getFieldValue(docente, "nombre"));
                item.put("email", getFieldValue(docente, "email"));
                item.put("especialidad", getFieldValue(docente, "especialidad"));
            } catch (Exception e) {
                item.put("error", "Error convirtiendo docente: " + e.getMessage());
            }
        } else if (resultado.getClass().getSimpleName().equals("Curso")) {
            // Convertir Curso a Map
            try {
                var curso = resultado;
                item.put("id", getFieldValue(curso, "id"));
                item.put("nombre", getFieldValue(curso, "nombre"));
                item.put("codigo", getFieldValue(curso, "codigo"));
                item.put("descripcion", getFieldValue(curso, "descripcion"));
                item.put("anio", getFieldValue(curso, "anio"));
                
                // Intentar obtener información del docente
                Object docente = getFieldValue(curso, "docente");
                if (docente != null && !docente.toString().equals("N/A")) {
                    item.put("docente", getFieldValue(docente, "nombre"));
                    item.put("docenteEmail", getFieldValue(docente, "email"));
                }
                
            } catch (Exception e) {
                item.put("error", "Error convirtiendo curso: " + e.getMessage());
            }
        } else if (resultado.getClass().getSimpleName().equals("Matricula")) {
            // Convertir Matricula a Map
            try {
                var matricula = resultado;
                item.put("id", getFieldValue(matricula, "id"));
                item.put("anio", getFieldValue(matricula, "anio"));
                
                // Intentar obtener información del estudiante y curso asociados
                Object estudiante = getFieldValue(matricula, "estudiante");
                Object curso = getFieldValue(matricula, "curso");
                
                if (estudiante != null && !estudiante.toString().equals("N/A")) {
                    item.put("estudiante", getFieldValue(estudiante, "nombre") + " " + getFieldValue(estudiante, "apellido"));
                    item.put("estudianteId", getFieldValue(estudiante, "id"));
                }
                
                if (curso != null && !curso.toString().equals("N/A")) {
                    item.put("curso", getFieldValue(curso, "nombre"));
                    item.put("cursoId", getFieldValue(curso, "id"));
                }
                
            } catch (Exception e) {
                item.put("error", "Error convirtiendo matricula: " + e.getMessage());
            }
        } else {
            // Para otros tipos de resultados
            item.put("valor", resultado.toString());
            item.put("tipo", resultado.getClass().getSimpleName());
        }
        
        return item;
    }

    private Object getFieldValue(Object obj, String fieldName) {
        try {
            var field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (Exception e) {
            return "N/A";
        }
    }

    private Map<String, String> extraerParametros(String pregunta) {
        Map<String, String> parametros = new HashMap<>();
        
        // Patrones para extraer información común
        Pattern nombrePattern = Pattern.compile("(llamado|nombre|se llama)\\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)", Pattern.CASE_INSENSITIVE);
        Pattern anioPattern = Pattern.compile("(año|del)\\s+(\\d{4})", Pattern.CASE_INSENSITIVE);
        Pattern generoPattern = Pattern.compile("(masculino|femenino|hombre|mujer)", Pattern.CASE_INSENSITIVE);
        
        Matcher nombreMatcher = nombrePattern.matcher(pregunta);
        if (nombreMatcher.find()) {
            parametros.put("nombre", nombreMatcher.group(2));
        }
        
        Matcher anioMatcher = anioPattern.matcher(pregunta);
        if (anioMatcher.find()) {
            parametros.put("anio", anioMatcher.group(2));
        }
        
        Matcher generoMatcher = generoPattern.matcher(pregunta);
        if (generoMatcher.find()) {
            String genero = generoMatcher.group(1).toLowerCase();
            if (genero.contains("masculino") || genero.contains("hombre")) {
                parametros.put("genero", "Masculino");
            } else if (genero.contains("femenino") || genero.contains("mujer")) {
                parametros.put("genero", "Femenino");
            }
        }
        
        return parametros;
    }
    
    /**
     * Generador de consultas JPQL de respaldo (sin IA)
     * Usado cuando OpenRouter no está disponible
     */
    private String generarJpqlFallback(String pregunta, Map<String, String> parametros) {
        String preguntaLower = pregunta.toLowerCase();
        
        // Consultas básicas más comunes
        if (preguntaLower.contains("cuántos estudiantes") || preguntaLower.contains("total estudiantes")) {
            return "SELECT COUNT(e) FROM Estudiante e";
        }
        
        if (preguntaLower.contains("todos los estudiantes") || preguntaLower.contains("listar estudiantes")) {
            return "SELECT e FROM Estudiante e";
        }
        
        if (preguntaLower.contains("estudiantes masculinos")) {
            return "SELECT e FROM Estudiante e WHERE e.genero = 'Masculino'";
        }
        
        if (preguntaLower.contains("estudiantes femeninos") || preguntaLower.contains("estudiantes mujeres")) {
            return "SELECT e FROM Estudiante e WHERE e.genero = 'Femenino'";
        }
        
        if (preguntaLower.contains("todos los cursos") || preguntaLower.contains("listar cursos")) {
            return "SELECT c FROM Curso c";
        }
        
        if (preguntaLower.contains("todos los docentes") || preguntaLower.contains("listar docentes")) {
            return "SELECT d FROM Docente d";
        }
        
        if (preguntaLower.contains("matriculas")) {
            if (parametros.containsKey("anio")) {
                return "SELECT m FROM Matricula m WHERE m.anio = " + parametros.get("anio");
            }
            return "SELECT m FROM Matricula m";
        }
        
        // Búsquedas por nombre específico
        if (parametros.containsKey("nombre")) {
            String nombre = parametros.get("nombre");
            if (preguntaLower.contains("estudiante")) {
                return "SELECT e FROM Estudiante e WHERE e.nombre LIKE '%" + nombre + "%'";
            }
            if (preguntaLower.contains("docente")) {
                return "SELECT d FROM Docente d WHERE d.nombre LIKE '%" + nombre + "%'";
            }
        }
        
        // Búsquedas por año
        if (parametros.containsKey("anio")) {
            String anio = parametros.get("anio");
            if (preguntaLower.contains("estudiante")) {
                return "SELECT e FROM Estudiante e WHERE e.matriculaAnio = " + anio;
            }
        }
        
        // Si no puede generar una consulta específica, retornar consulta básica
        return "SELECT e FROM Estudiante e";
    }
}
