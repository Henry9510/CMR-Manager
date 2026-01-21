package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes_trabajo")
@Getter
@Setter
public class OrdenTrabajo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo; // Código único de la OT
    private String titulo; // Título de la orden
    private String descripcion; // Descripción detallada
    
    @ManyToOne
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;

    @ManyToOne
    @JoinColumn(name = "tipo_id")
    private TipoEquipo tipo; // Preventivo, Correctivo, etc.

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private EstadoEquipo estado; // Creada, Planificada, En Ejecución, Cerrada

    @ManyToOne
    @JoinColumn(name = "prioridad_id")
    private Criticidad prioridad; // Usa Criticidad como prioridad (Alta, Media, Baja)

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaProgramada;
    private LocalDateTime fechaCompletacion;
    
    private Float horasEstimadas;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
