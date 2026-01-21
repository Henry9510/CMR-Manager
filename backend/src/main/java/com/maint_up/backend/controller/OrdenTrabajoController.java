package com.maint_up.backend.controller;

import com.maint_up.backend.model.OrdenTrabajo;
import com.maint_up.backend.model.EstadoEquipo;
import com.maint_up.backend.repository.OrdenTrabajoRepository;
import com.maint_up.backend.repository.EstadoEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes-trabajo")
@CrossOrigin(origins = "*")
public class OrdenTrabajoController {

    @Autowired
    private OrdenTrabajoRepository ordenTrabajoRepository;

    @Autowired
    private EstadoEquipoRepository estadoEquipoRepository;

    @GetMapping
    public List<OrdenTrabajo> getAllOrdenes() {
        return ordenTrabajoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<OrdenTrabajo> getOrdenById(@PathVariable Long id) {
        return ordenTrabajoRepository.findById(id);
    }

    @PostMapping
    public OrdenTrabajo createOrden(@RequestBody OrdenTrabajo orden) {
        // Si no tiene estado, asignamos "Creada"
        if (orden.getEstado() == null && orden.getEstado() == null) {
            EstadoEquipo estadoCreada = estadoEquipoRepository.findAll().stream()
                    .filter(e -> e.getNombre().equals("Creada"))
                    .findFirst()
                    .orElse(null);
            orden.setEstado(estadoCreada);
        }
        
        return ordenTrabajoRepository.save(orden);
    }

    @PutMapping("/{id}")
    public OrdenTrabajo updateOrden(@PathVariable Long id, @RequestBody OrdenTrabajo ordenDetails) {
        return ordenTrabajoRepository.findById(id).map(orden -> {
            orden.setTitulo(ordenDetails.getTitulo());
            orden.setDescripcion(ordenDetails.getDescripcion());
            orden.setEstado(ordenDetails.getEstado());
            orden.setFechaProgramada(ordenDetails.getFechaProgramada());
            orden.setHorasEstimadas(ordenDetails.getHorasEstimadas());
            return ordenTrabajoRepository.save(orden);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteOrden(@PathVariable Long id) {
        ordenTrabajoRepository.deleteById(id);
    }
}
