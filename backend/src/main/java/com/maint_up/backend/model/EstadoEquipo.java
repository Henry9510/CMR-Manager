package com.maint_up.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "estado_equipo")
@Getter 
@Setter
public class EstadoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;   // Operativo, Detenido, Mantenimiento
}

