package com.maint_up.backend.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "estado_equipo")
@Getter 
@Setter
public class EstadoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;   // Operativo, Detenido, Mantenimiento

    @OneToMany(mappedBy = "estado")
    @JsonBackReference
    private List<Equipo> equipos;
}

