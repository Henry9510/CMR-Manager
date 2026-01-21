package com.maint_up.backend.repository;

import com.maint_up.backend.model.EstadoComponente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoComponenteRepository extends JpaRepository<EstadoComponente, Long> {
}
