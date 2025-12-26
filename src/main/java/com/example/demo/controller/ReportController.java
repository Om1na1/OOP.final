package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private TransactionService transactionService;

    @GetMapping("/overdue")
    public ResponseEntity<Map<String, Object>> getOverdueBooks() {
        List<Transaction> overdueTransactions = transactionService.getOverdueBooks();
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalOverdue", overdueTransactions.size());
        response.put("overdueBooks", overdueTransactions);
        
        return ResponseEntity.ok(response);
    }
}

