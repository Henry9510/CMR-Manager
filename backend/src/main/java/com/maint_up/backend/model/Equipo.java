package com.maint_up.backend.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "equipos")
@Getter
@Setter
public class Equipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Nombre de la máquina
    private String codigo; // Opcional: código interno de máquina

    @ManyToOne
    @JoinColumn(name = "ubicacion_id")
    @JsonManagedReference
    private Ubicacion ubicacion;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    @JsonManagedReference
    private EstadoEquipo estado;

    @ManyToOne
    @JoinColumn(name = "criticidad_id")
    @JsonManagedReference
    private Criticidad criticidad;

    private Float horasTrabajo = 0f; // Horas de trabajo acumuladas
    private Float horasMantenimiento = 500f; // Horas para hacer mantenimiento

    @OneToMany(mappedBy = "equipo", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Componente> componentes; // Piezas que pueden fallar
}
