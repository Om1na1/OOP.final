package com.example.demo.repository;

import com.example.demo.model.Transaction;
import com.example.demo.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByMemberId(Long memberId);
    List<Transaction> findByBookId(Long bookId);
    List<Transaction> findByStatus(TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = :status AND t.dueDate < :currentDate")
    List<Transaction> findOverdueTransactions(@Param("status") TransactionStatus status, @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.member.id = :memberId AND t.status = 'BORROWED'")
    List<Transaction> findActiveBorrowsByMember(@Param("memberId") Long memberId);
}

