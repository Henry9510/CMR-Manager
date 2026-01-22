package com.maint_up.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdenTrabajoDTO {
    public String titulo;
    public String descripcion;
    public String tipo;
    public String asignadoA;
    public Long equipoId;
    public String prioridad;
    public Float horasEstimadas;
    public String fechaProgramada;
}
