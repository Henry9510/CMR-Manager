package com.maint_up.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Getter
@Setter
@Entity
@Table(name = "componente")
public class Componente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Nombre del componente
    private String numeroParte; // Número de parte del componente

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipo_id")
    @JsonBackReference
    private Equipo equipo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_componente_id")
    @JsonManagedReference
    private EstadoComponente estado;


    private Float horasTrabajo = 0f; // Horas de trabajo acumuladas del componente
    private Float horasMantenimiento = 300f; // Horas para hacer mantenimiento del componente
    
    private Integer vecesReparado = 0; // Número de veces que ha sido reparado
    private Integer vecesCambiado = 0; // Número de veces que ha sido reemplazado/cambiado
    private Integer vecesFallado = 0; // Número de veces que ha fallado
}
