package com.maint_up.backend.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.lang.NonNull;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class IoTWebSocketHandler extends TextWebSocketHandler {

    private static final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("Nuevo cliente conectado: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("Cliente desconectado: " + session.getId());
    }

    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Mensaje recibido: " + payload);
    }

    public static void broadcastToAll(Object message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String jsonMessage = mapper.writeValueAsString(message);
            TextMessage textMessage = new TextMessage(jsonMessage);

            for (WebSocketSession session : sessions) {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(textMessage);
                    }
                } catch (IOException e) {
                    System.err.println("Error enviando mensaje: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Error al serializar mensaje: " + e.getMessage());
        }
    }
}
