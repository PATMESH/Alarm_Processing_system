package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.NMS;

public interface NMSRepository extends JpaRepository<NMS, Long> {}