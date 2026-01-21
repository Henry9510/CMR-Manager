package com.maint_up.backend.controller;

import com.maint_up.backend.model.OrdenTrabajo;
import com.maint_up.backend.model.EstadoEquipo;
import com.maint_up.backend.repository.OrdenTrabajoRepository;
import com.maint_up.backend.repository.EstadoEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<OrdenTrabajo>> getAllOrdenes() {
        try {
            List<OrdenTrabajo> ordenes = ordenTrabajoRepository.findAll();
            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> getOrdenById(@PathVariable Long id) {
        try {
            Optional<OrdenTrabajo> orden = ordenTrabajoRepository.findById(id);
            return orden.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<OrdenTrabajo> createOrden(@RequestBody OrdenTrabajo orden) {
        try {
            // Si no tiene estado, asignamos "Creada"
            if (orden.getEstado() == null) {
                EstadoEquipo estadoCreada = estadoEquipoRepository.findAll().stream()
                        .filter(e -> e.getNombre().equals("Creada"))
                        .findFirst()
                        .orElse(null);
                orden.setEstado(estadoCreada);
            }
            
            OrdenTrabajo ordenGuardada = ordenTrabajoRepository.save(orden);
            return ResponseEntity.status(HttpStatus.CREATED).body(ordenGuardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> updateOrden(@PathVariable Long id, @RequestBody OrdenTrabajo ordenDetails) {
        try {
            return ordenTrabajoRepository.findById(id).map(orden -> {
                if (ordenDetails.getTitulo() != null) {
                    orden.setTitulo(ordenDetails.getTitulo());
                }
                if (ordenDetails.getDescripcion() != null) {
                    orden.setDescripcion(ordenDetails.getDescripcion());
                }
                if (ordenDetails.getEstado() != null) {
                    orden.setEstado(ordenDetails.getEstado());
                }
                if (ordenDetails.getFechaProgramada() != null) {
                    orden.setFechaProgramada(ordenDetails.getFechaProgramada());
                }
                if (ordenDetails.getHorasEstimadas() != null) {
                    orden.setHorasEstimadas(ordenDetails.getHorasEstimadas());
                }
                if (ordenDetails.getTipo() != null) {
                    orden.setTipo(ordenDetails.getTipo());
                }
                if (ordenDetails.getPrioridad() != null) {
                    orden.setPrioridad(ordenDetails.getPrioridad());
                }
                if (ordenDetails.getEquipo() != null) {
                    orden.setEquipo(ordenDetails.getEquipo());
                }
                if (ordenDetails.getFechaCompletacion() != null) {
                    orden.setFechaCompletacion(ordenDetails.getFechaCompletacion());
                }
                
                OrdenTrabajo ordenActualizada = ordenTrabajoRepository.save(orden);
                return ResponseEntity.ok(ordenActualizada);
            }).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrden(@PathVariable Long id) {
        try {
            if (ordenTrabajoRepository.existsById(id)) {
                ordenTrabajoRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
