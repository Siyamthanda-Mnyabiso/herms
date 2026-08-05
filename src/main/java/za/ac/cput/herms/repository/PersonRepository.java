package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.herms.domain.Person;

import java.util.List;

public interface PersonRepository extends JpaRepository<Person,Long> {
    @Override
    List<Person> findAll();
    Person findByPersonId(Long personId);
}
