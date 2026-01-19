package com.maint_up.backend.service;

import com.maint_up.backend.model.Equipo;
import com.maint_up.backend.repository.EquipoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;

    public EquipoService(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    // Obtener todos los equipos
    public List<Equipo> obtenerTodos() {
        return equipoRepository.findAll();
    }

    // Obtener equipo por ID
    public Equipo obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    // Crear equipo
    public Equipo crearEquipo(Equipo equipo) {
        if (equipo == null || equipo.getCodigo() == null || equipo.getNombre() == null) {
            throw new IllegalArgumentException("El equipo, nombre y código no pueden ser nulos");
        }
        if (equipoRepository.existsByCodigo(equipo.getCodigo())) {
            throw new RuntimeException("Ya existe un equipo con ese código");
        }
        return equipoRepository.save(equipo);
    }

    // Actualizar equipo
    public Equipo actualizarEquipo(Long id, Equipo equipo) {
        Equipo existente = obtenerPorId(id);

        existente.setNombre(equipo.getNombre());
        existente.setCodigo(equipo.getCodigo());
        existente.setUbicacion(equipo.getUbicacion());
        if (equipo.getTipo() != null) {
            existente.setTipo(equipo.getTipo());
        }
        if (equipo.getEstado() != null) {
            existente.setEstado(equipo.getEstado());
        }
        if (equipo.getCriticidad() != null) {
            existente.setCriticidad(equipo.getCriticidad());
        }

        return equipoRepository.save(existente);
    }

    // Eliminar equipo
    public void eliminarEquipo(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        if (!equipoRepository.existsById(id)) {
            throw new RuntimeException("Equipo no encontrado");
        }
        equipoRepository.deleteById(id);
    }
}
