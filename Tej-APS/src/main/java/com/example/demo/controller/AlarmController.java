package com.example.demo.controller;

import com.example.demo.entity.Alarm;
import com.example.demo.entity.User;
import com.example.demo.services.AlarmService;
import com.example.demo.services.DeviceService;
import com.example.demo.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/alarms")
@CrossOrigin(origins = "http://localhost:3000")
public class AlarmController {

    @Autowired
    private AlarmService alarmService;
    
    @Autowired
    private UserService userService; 
    
    @Autowired
    private DeviceService deviceService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private final SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);


    @PostMapping("/resolve/{id}")
    public ResponseEntity<Alarm> resolveAlarm(@PathVariable long id, @RequestParam long userId) {
        Alarm alarm = alarmService.getAlarmById(id);
        if (alarm == null) {
            return ResponseEntity.notFound().build();
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        alarm.setStatus("Resolved");
        alarm.setResolvedAt(LocalDateTime.now());
        alarm.setResolvedBy(user);

        Alarm updatedAlarm = alarmService.saveAlarm(alarm);
        return ResponseEntity.ok(updatedAlarm);
    }

    @PostMapping("/add")
    public Alarm addAlarm(@RequestBody Alarm alarm) {
        return alarmService.saveAlarm(alarm);
    }

    @GetMapping("/all")
    public List<Alarm> getAllAlarms() {
        return alarmService.getAllAlarms();
    }

    @GetMapping("/{id}")
    public Alarm getAlarmById(@PathVariable long id) {
        return alarmService.getAlarmById(id);
    }
    
    
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResolvedAlarms() throws IOException {
        List<Alarm> resolvedAlarms = alarmService.getResolvedAlarms();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Resolved Alarms");

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Name");
        headerRow.createCell(2).setCellValue("Priority");
        headerRow.createCell(3).setCellValue("Device");
        headerRow.createCell(4).setCellValue("Raised At");
        headerRow.createCell(5).setCellValue("Resolved At");
        headerRow.createCell(6).setCellValue("Resolved By");

        int rowNum = 1;
        for (Alarm alarm : resolvedAlarms) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(alarm.getId());
            row.createCell(1).setCellValue(alarm.getName());
            row.createCell(2).setCellValue(alarm.getPriority());
            row.createCell(3).setCellValue(alarm.getDevice().getName());
            row.createCell(4).setCellValue(formatDateTime(alarm.getRaisedAt()));
            row.createCell(5).setCellValue(formatDateTime(alarm.getResolvedAt()));
            row.createCell(6).setCellValue(alarm.getResolvedBy().getName());
        }

        for (int i = 0; i < 7; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        // Prepare response
        byte[] bytes = outputStream.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "resolved_alarms.xlsx");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(bytes);
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return dateTime.format(formatter);
    }
    

    @PostMapping("/send")
    public ResponseEntity<String> sendAlarm(@RequestBody Alarm alarm) {
        try {
            alarm.setRaisedAt(LocalDateTime.now());
            alarm.setStatus("Pending");

            Alarm savedAlarm = alarmService.saveAlarm(alarm);
            
            savedAlarm.setDevice(deviceService.getDeviceById(savedAlarm.getDevice().getId()));

            alarmService.sendAlarm(alarmService.getAlarmById(savedAlarm.getId()));
            
            String alarmJson = objectMapper.writeValueAsString(savedAlarm);
            emitter.send(alarmJson);

            return ResponseEntity.ok("Alarm sent and saved");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing alarm");
        }
    }

    @GetMapping("/stream")
    public SseEmitter streamAlarms() {
        return emitter;
    }
}
