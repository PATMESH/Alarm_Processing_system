package com.example.demo.services;

import com.example.demo.entity.NMS;
import com.example.demo.repository.NMSRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NMSService {

    @Autowired
    private NMSRepository nmsRepository;

    public NMS saveNMS(NMS nms) {
        return nmsRepository.save(nms);
    }

    public List<NMS> getAllNMS() {
        return nmsRepository.findAll();
    }

    public NMS getNMSById(long id) {
        return nmsRepository.findById(id).orElse(null);
    }
}
