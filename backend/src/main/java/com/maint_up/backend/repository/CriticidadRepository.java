package com.maint_up.backend.repository;

import com.maint_up.backend.model.Criticidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CriticidadRepository extends JpaRepository<Criticidad, Long> {
}
