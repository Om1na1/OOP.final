package com.example.demo.service;

import com.example.demo.model.Book;
import com.example.demo.model.Member;
import com.example.demo.model.Transaction;
import com.example.demo.model.TransactionStatus;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    public Transaction borrowBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No available copies of this book");
        }

        if (!member.getIsActive()) {
            throw new RuntimeException("Member is not active");
        }

        Transaction transaction = new Transaction(book, member);
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return transactionRepository.save(transaction);
    }

    public Transaction returnBook(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));

        if (transaction.getStatus() == TransactionStatus.RETURNED) {
            throw new RuntimeException("Book already returned");
        }

        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        transaction.setReturnDate(LocalDate.now());
        transaction.setStatus(TransactionStatus.RETURNED);

        // Calculate fine if overdue
        if (transaction.getDueDate().isBefore(LocalDate.now())) {
            long daysOverdue = LocalDate.now().toEpochDay() - transaction.getDueDate().toEpochDay();
            transaction.setFineAmount(daysOverdue * 1.0); // $1 per day
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByMember(Long memberId) {
        return transactionRepository.findByMemberId(memberId);
    }

    public List<Transaction> getOverdueBooks() {
        return transactionRepository.findOverdueTransactions(TransactionStatus.BORROWED, LocalDate.now());
    }

    public List<Transaction> getActiveBorrowsByMember(Long memberId) {
        return transactionRepository.findActiveBorrowsByMember(memberId);
    }
}

