package com.maint_up.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ubicaciones")
@Getter 
@Setter
public class Ubicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;   // Planta A, Línea 1, Área Soldadura
    private String tipo;     // Planta, Línea, Área
}
