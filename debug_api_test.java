// Test manual de conexión a OpenRouter
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class DebugApiTest {
    public static void main(String[] args) {
        try {
            String apiKey = "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";
            String url = "https://openrouter.ai/api/v1/chat/completions";
            
            String requestBody = """
                {
                    "model": "openai/gpt-4o",
                    "messages": [
                        {"role": "user", "content": "Test message"}
                    ],
                    "max_tokens": 50
                }
                """;
            
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .header("HTTP-Referer", "https://edudata-backend.onrender.com")
                .header("X-Title", "EduData")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response Headers: " + response.headers().map());
            System.out.println("Response Body: " + response.body());
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
