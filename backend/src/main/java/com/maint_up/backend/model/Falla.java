package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "fallas")
@Getter
@Setter
public class Falla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;
    private String tipo;
    private String descripcion;
    private String causaRaiz;
    private String correctivo;
    
    @ManyToOne
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;

    @ManyToOne
    @JoinColumn(name = "orden_trabajo_id")
    private OrdenTrabajo ordenTrabajo;

    private LocalDateTime fecha;
    private Float tiempoParada; // en horas
    private Double costo;

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
    }
}
