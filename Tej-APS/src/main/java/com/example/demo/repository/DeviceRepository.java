package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Device;

public interface DeviceRepository extends JpaRepository<Device, Long> {}