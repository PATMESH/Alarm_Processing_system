package com.example.demo.controller;

import com.example.demo.entity.NMS;
import com.example.demo.services.NMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nms")
@CrossOrigin(origins = "*")
public class NMSController {

    @Autowired
    private NMSService nmsService;

    @PostMapping("/add")
    public NMS addNMS(@RequestBody NMS nms) {
        return nmsService.saveNMS(nms);
    }

    @GetMapping("/all")
    public List<NMS> getAllNMS() {
        return nmsService.getAllNMS();
    }

    @GetMapping("/{id}")
    public NMS getNMSById(@PathVariable long id) {
        return nmsService.getNMSById(id);
    }
}
