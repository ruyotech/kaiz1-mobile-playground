package com.kaiz.lifeos.lifewheel.infrastructure;

import com.kaiz.lifeos.lifewheel.domain.LifeWheelArea;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LifeWheelAreaRepository extends JpaRepository<LifeWheelArea, String> {

  @Query("SELECT l FROM LifeWheelArea l ORDER BY l.displayOrder")
  List<LifeWheelArea> findAllOrderByDisplayOrder();
}
