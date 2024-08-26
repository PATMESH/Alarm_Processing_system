package com.example.demo.services;

import com.example.demo.entity.Alarm;
import com.example.demo.repository.AlarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlarmService {

    @Autowired
    private AlarmRepository alarmRepository;
    
    @Autowired
    private KafkaTemplate<String, Alarm> kafkaTemplate;

    public void sendAlarm(Alarm alarm) {
        kafkaTemplate.send("alarms", alarm);
    }

    public Alarm saveAlarm(Alarm alarm) {
        return alarmRepository.save(alarm);
    }

    public List<Alarm> getAllAlarms() {
        return alarmRepository.findAll();
    }

    public Alarm getAlarmById(long id) {
        return alarmRepository.findById(id).orElse(null);
    }

	public List<Alarm> getResolvedAlarms() {
		return alarmRepository.findByStatus("Resolved");
	}
}
