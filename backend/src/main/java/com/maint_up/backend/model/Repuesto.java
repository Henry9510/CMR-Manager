package com.maint_up.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "repuestos")
@Getter
@Setter
public class Repuesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;
    private String nombre;
    private String descripcion;
    private String categoria;
    private Integer stock = 0;
    private Integer stockMinimo = 0;
    private Integer stockMaximo = 0;
    private BigDecimal costoUnitario;
    private String ubicacion;
    private String proveedor;
}
