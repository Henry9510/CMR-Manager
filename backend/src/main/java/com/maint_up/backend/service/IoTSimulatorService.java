package com.maint_up.backend.service;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.maint_up.backend.websocket.IoTWebSocketHandler;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@EnableScheduling
public class IoTSimulatorService {

    private final Map<Integer, Float> equipmentHours = new HashMap<>();
    private final Map<Integer, Float> maintenanceHours = new HashMap<>();
    private final Random random = new Random();

    public IoTSimulatorService() {
        // Inicializar equipos simulados con horas iniciales
        equipmentHours.put(1, 450.5f);  // Equipo 1: 450.5 horas (cercano a 500)
        equipmentHours.put(2, 150.3f);  // Equipo 2: 150.3 horas
        equipmentHours.put(3, 89.7f);   // Equipo 3: 89.7 horas
        equipmentHours.put(4, 480.2f);  // Equipo 4: 480.2 horas (muy cercano a 500)
        equipmentHours.put(5, 120.8f);  // Equipo 5: 120.8 horas

        // Horas requeridas para mantenimiento por equipo
        maintenanceHours.put(1, 500f);  // Mantenimiento cada 500 horas
        maintenanceHours.put(2, 500f);
        maintenanceHours.put(3, 500f);
        maintenanceHours.put(4, 500f);
        maintenanceHours.put(5, 500f);
    }

    // Enviar datos cada 5 segundos
    @Scheduled(fixedDelay = 5000)
    public void simulateIoTData() {
        Map<String, Object> iotData = new HashMap<>();
        iotData.put("timestamp", System.currentTimeMillis());
        iotData.put("type", "equipment_hours");
        
        Map<Integer, Map<String, Object>> equipment = new HashMap<>();

        for (Map.Entry<Integer, Float> entry : equipmentHours.entrySet()) {
            int equipmentId = entry.getKey();
            float currentHours = entry.getValue();

            // Incrementar horas (simular uso)
            float increment = 0.01f + (random.nextFloat() * 0.04f);
            currentHours += increment;
            equipmentHours.put(equipmentId, currentHours);

            // Obtener horas de mantenimiento
            float maintenanceThreshold = maintenanceHours.get(equipmentId);
            
            // Calcular porcentaje de uso
            float usagePercentage = (currentHours / maintenanceThreshold) * 100;
            
            // Determinar estado basado en proximidad al mantenimiento
            String maintenanceStatus = "OK";
            if (usagePercentage >= 100) {
                maintenanceStatus = "OVERDUE"; // Vencido
            } else if (usagePercentage >= 90) {
                maintenanceStatus = "CRITICAL"; // Crítico (> 90%)
            } else if (usagePercentage >= 75) {
                maintenanceStatus = "WARNING"; // Advertencia (> 75%)
            }

            // Crear objeto con datos del equipo
            Map<String, Object> equipData = new HashMap<>();
            equipData.put("id", equipmentId);
            equipData.put("hours", Math.round(currentHours * 100.0) / 100.0);
            equipData.put("maintenanceHours", maintenanceThreshold);
            equipData.put("usagePercentage", Math.round(usagePercentage * 100.0) / 100.0);
            equipData.put("maintenanceStatus", maintenanceStatus);
            equipData.put("status", random.nextBoolean() ? "Operativo" : "Mantenimiento");
            equipData.put("temperature", 35 + random.nextInt(50));
            equipData.put("vibration", Math.round((random.nextFloat() * 5) * 100.0) / 100.0);

            equipment.put(equipmentId, equipData);
        }

        iotData.put("equipment", equipment);

        // Enviar a todos los clientes WebSocket
        IoTWebSocketHandler.broadcastToAll(iotData);
    }
}
