package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Alarm;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
	List<Alarm> findByStatus(String status);
}