package com.maint_up.backend.repository;

import com.maint_up.backend.model.OrdenTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {
    
    // Buscar por código
    Optional<OrdenTrabajo> findByCodigo(String codigo);
    
    // Buscar por equipo
    List<OrdenTrabajo> findByEquipoId(Long equipoId);
    
    // Buscar por estado
    List<OrdenTrabajo> findByEstadoId(Long estadoId);
    
    // Buscar por tipo
    List<OrdenTrabajo> findByTipoId(Long tipoId);
    
    // Buscar por prioridad
    List<OrdenTrabajo> findByPrioridadId(Long prioridadId);
    
    // Búsqueda personalizada
    @Query("SELECT o FROM OrdenTrabajo o WHERE " +
           "LOWER(o.codigo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.titulo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.descripcion) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<OrdenTrabajo> buscarPorPalabra(@Param("keyword") String keyword);
}
