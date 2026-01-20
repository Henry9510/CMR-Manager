package com.maint_up.backend.repository;

import com.maint_up.backend.model.EstadoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoEquipoRepository extends JpaRepository<EstadoEquipo, Long> {
}
