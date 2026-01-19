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
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    // Crear equipo
    public Equipo crearEquipo(Equipo equipo) {
        if (equipoRepository.existsByNumeroParte(equipo.getNumeroParte())) {
            throw new RuntimeException("Ya existe un equipo con ese número de parte");
        }
        return equipoRepository.save(equipo);
    }

    // Actualizar equipo
    public Equipo actualizarEquipo(Long id, Equipo equipo) {
        Equipo existente = obtenerPorId(id);

        existente.setNombre(equipo.getNombre());
        existente.setNumeroParte(equipo.getNumeroParte());
        existente.setTipo(equipo.getTipo());
        existente.setEstado(equipo.getEstado());    

        return equipoRepository.save(existente);
    }

    // Eliminar equipo
    public void eliminarEquipo(Long id) {
    }
}
