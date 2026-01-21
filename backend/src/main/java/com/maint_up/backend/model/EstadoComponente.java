package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "estado_componente")
@Getter
@Setter
public class EstadoComponente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Óptimo, Funcional, Esperando Repuesto, En Reparación, Falla
    private String descripcion;
}
