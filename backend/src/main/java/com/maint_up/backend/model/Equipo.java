package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "equipos")
@Getter @Setter
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String numeroParte;

    @ManyToOne
    @JoinColumn(name = "tipo_id")
    private TipoEquipo tipo;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private EstadoEquipo estado;

    @ManyToOne
    @JoinColumn(name = "criticidad_id")
    private Criticidad criticidad;

    @ManyToOne
    @JoinColumn(name = "ubicacion_id")
    private Ubicacion ubicacion;

}
