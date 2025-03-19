package com.sidehustle.backend;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {

    User findByEmail(String email);

    void deleteById(Long id);

    boolean existsById(Long id);

    }
