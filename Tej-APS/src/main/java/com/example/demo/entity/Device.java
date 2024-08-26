package com.example.demo.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String model;

    @ManyToOne
    @JoinColumn(name = "nms_id", nullable = false)
    @JsonIgnoreProperties("devices")
    private NMS nms;
    
    @OneToMany(mappedBy = "device")
    @JsonIgnoreProperties("device")
    private List<Alarm> alarms;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public NMS getNms() {
		return nms;
	}

	public void setNms(NMS nms) {
		this.nms = nms;
	}

	public List<Alarm> getAlarms() {
		return alarms;
	}

	public void setAlarms(List<Alarm> alarms) {
		this.alarms = alarms;
	}
    
    

}

