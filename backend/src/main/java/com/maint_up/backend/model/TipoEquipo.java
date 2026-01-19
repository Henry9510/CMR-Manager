package com.maint_up.backend.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "tipo_equipo")
@Getter @Setter
public class TipoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Ej: "Banda transportadora", "Cortadora", "Robot industrial"
    private String descripcion; // Opcional, para detallar características del tipo

    @OneToMany(mappedBy = "tipo")
    @JsonBackReference
    private List<Equipo> equipos; // Equipos de este tipo
}


