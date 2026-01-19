package com.maint_up.backend.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "criticidades")
@Getter @Setter
public class Criticidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nivel;    // Alta, Media, Baja

    @OneToMany(mappedBy = "criticidad")
    @JsonBackReference
    private List<Equipo> equipos;
}
