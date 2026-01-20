package com.maint_up.backend.service;

import com.maint_up.backend.model.Equipo;
import com.maint_up.backend.dto.EquipoDTO;
import com.maint_up.backend.repository.EquipoRepository;
import com.maint_up.backend.repository.TipoEquipoRepository;
import com.maint_up.backend.repository.UbicacionRepository;
import com.maint_up.backend.repository.EstadoEquipoRepository;
import com.maint_up.backend.repository.CriticidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final TipoEquipoRepository tipoEquipoRepository;
    private final UbicacionRepository ubicacionRepository;
    private final EstadoEquipoRepository estadoEquipoRepository;
    private final CriticidadRepository criticidadRepository;

    public EquipoService(EquipoRepository equipoRepository,
                        TipoEquipoRepository tipoEquipoRepository,
                        UbicacionRepository ubicacionRepository,
                        EstadoEquipoRepository estadoEquipoRepository,
                        CriticidadRepository criticidadRepository) {
        this.equipoRepository = equipoRepository;
        this.tipoEquipoRepository = tipoEquipoRepository;
        this.ubicacionRepository = ubicacionRepository;
        this.estadoEquipoRepository = estadoEquipoRepository;
        this.criticidadRepository = criticidadRepository;
    }

    public List<Equipo> obtenerTodos() {
        return equipoRepository.findAll();
    }

    public Equipo obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    public Equipo crearEquipo(EquipoDTO dto) {
        if (dto == null || dto.nombre == null || dto.codigo == null) {
            throw new IllegalArgumentException("Nombre y código son requeridos");
        }
        if (equipoRepository.existsByCodigo(dto.codigo)) {
            throw new RuntimeException("Ya existe un equipo con ese código");
        }
        
        Equipo equipo = new Equipo();
        mapearDtoAEquipo(dto, equipo);
        return equipoRepository.save(equipo);
    }

    public Equipo actualizarEquipo(Long id, EquipoDTO dto) {
        Equipo existente = obtenerPorId(id);
        mapearDtoAEquipo(dto, existente);
        return equipoRepository.save(existente);
    }

    public void eliminarEquipo(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        Equipo equipo = obtenerPorId(id);
        equipoRepository.delete(equipo);
    }

    private void mapearDtoAEquipo(EquipoDTO dto, Equipo equipo) {
        equipo.setNombre(dto.nombre);
        equipo.setCodigo(dto.codigo);
        
        if (dto.tipoId != null) {
            equipo.setTipo(tipoEquipoRepository.findById(dto.tipoId).orElse(null));
        }
        if (dto.ubicacionId != null) {
            equipo.setUbicacion(ubicacionRepository.findById(dto.ubicacionId).orElse(null));
        }
        if (dto.estadoId != null) {
            equipo.setEstado(estadoEquipoRepository.findById(dto.estadoId).orElse(null));
        }
        if (dto.criticidadId != null) {
            equipo.setCriticidad(criticidadRepository.findById(dto.criticidadId).orElse(null));
        }
    }
}
