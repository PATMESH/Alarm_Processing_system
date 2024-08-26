package com.example.demo.controller;


import com.example.demo.entity.Device;
import com.example.demo.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @PostMapping("/add")
    public Device addDevice(@RequestBody Device device) {
        return deviceService.saveDevice(device);
    }

    @GetMapping("/all")
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/{id}")
    public Device getDeviceById(@PathVariable long id) {
        return deviceService.getDeviceById(id);
    }
}
