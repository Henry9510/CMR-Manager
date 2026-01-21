package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "planes_mantenimiento")
@Getter
@Setter
public class PlanMantenimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;
    private String nombre;
    private String tipo; // Preventivo, Predictivo
    private Integer frecuencia;
    private String unidadFrecuencia; // Horas, Días, Semanas, Meses
    private LocalDateTime ultimaEjecucion;
    private LocalDateTime proximaEjecucion;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;
}
