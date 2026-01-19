package com.maint_up.backend.repository;

import com.maint_up.backend.model.Componente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponenteRepository extends JpaRepository<Componente, Long> {
    
    // Buscar componentes por equipo
    List<Componente> findByEquipoId(Long equipoId);
    
    // Buscar componentes por número de parte
    Componente findByNumeroParte(String numeroParte);
    
    // Verificar si existe un componente con número de parte
    boolean existsByNumeroParte(String numeroParte);
}
