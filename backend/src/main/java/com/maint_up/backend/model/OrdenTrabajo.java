package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ordenes_trabajo")
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializationException"})
public class OrdenTrabajo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo; // Código único de la OT
    private String titulo; // Título de la orden
    private String descripcion; // Descripción detallada
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_id")
    private TipoEquipo tipo; // Preventivo, Correctivo, etc.

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id")
    private EstadoEquipo estado; // Creada, Planificada, En Ejecución, Cerrada

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prioridad_id")
    private Criticidad prioridad; // Usa Criticidad como prioridad (Alta, Media, Baja)

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaProgramada;
    private LocalDateTime fechaCompletacion;
    
    private Float horasEstimadas;

    // Relaciones inversas
    @OneToMany(mappedBy = "ordenTrabajo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Falla> fallas;

    @OneToMany(mappedBy = "ordenTrabajo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrdenTrabajoRepuesto> repuestos;

    @OneToMany(mappedBy = "ordenTrabajo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrdenTrabajoAsignacion> asignaciones;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
