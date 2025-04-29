package com.email.smartAI.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {
	
	private final WebClient webClient;
	
	public EmailGeneratorService(WebClient.Builder webClientBuilder) {
//		super();
		this.webClient = webClientBuilder.build();
	}

	@Value("${gemini.api.url}")
	private String geminiApiURL;
	
	@Value("${gemini.api.key}")
	private String geminiApiKey;

	public String generateEmailReply(EmailRequest emailRequest) {
		
		//The prompt that will go as an input to Gemini API
		String prompt = buildPrompt(emailRequest);
		
		//Create a request (in the correct format)
		Map<String, Object> requestBody = Map.of(
				"contents", new Object[] {
						Map.of("parts", new Object[] {
								Map.of("text", prompt)
						})
				});
		
		//Send request and Get Response
		String response = webClient.post().uri(geminiApiURL + geminiApiKey).header("Content-Type", "application/json").bodyValue(requestBody).retrieve().bodyToMono(String.class).block();
		
		//Returning the Response
		return extractResponseContent(response);
		
	}


	private String extractResponseContent(String response) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode rootNode = mapper.readTree(response);
			return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
		} catch (Exception e) {
			return "Error processing the request. " + e.getMessage();
		}
	}
	private String buildPrompt(EmailRequest emailRequest) {
		StringBuilder prompt = new StringBuilder();
	
		prompt.append("Generate an Email reply for the following email content. Please do not add a subject line in the response. ");
		if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
		    prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
		}
		prompt.append("\nOriginal Email received: \n").append(emailRequest.getEmailContent());
		
		return prompt.toString();
	}
}
