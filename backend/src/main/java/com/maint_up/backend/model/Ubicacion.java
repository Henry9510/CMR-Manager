package com.maint_up.backend.model;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "ubicaciones")
@Getter 
@Setter
public class Ubicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Nombre de la línea de producción

    @OneToMany(mappedBy = "ubicacion")
    @JsonBackReference
    private List<Equipo> equipos; // Máquinas en esa ubicación
}


