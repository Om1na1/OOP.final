package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        try {
            Transaction transaction = transactionService.getTransactionById(id);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/borrow")
    public ResponseEntity<Transaction> borrowBook(@RequestParam Long bookId, @RequestParam Long memberId) {
        try {
            Transaction transaction = transactionService.borrowBook(bookId, memberId);
            return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<Transaction> returnBook(@PathVariable Long id) {
        try {
            Transaction transaction = transactionService.returnBook(id);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Transaction>> getTransactionsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(transactionService.getTransactionsByMember(memberId));
    }

    @GetMapping("/member/{memberId}/active")
    public ResponseEntity<List<Transaction>> getActiveBorrowsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(transactionService.getActiveBorrowsByMember(memberId));
    }
}

