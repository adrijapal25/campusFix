package com.campusFix.backend.controller;

import com.campusFix.backend.model.Issue;
import com.campusFix.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173") // Enables connection from React frontend
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        return issueRepository.save(issue);
    }

    // Toggle Status (OPEN <-> RESOLVED)
    @PutMapping("/{id}/status")
    public ResponseEntity<Issue> toggleStatus(@PathVariable Long id) {
        return issueRepository.findById(id)
                .map(issue -> {
                    if ("RESOLVED".equals(issue.getStatus())) {
                        issue.setStatus("OPEN");
                    } else {
                        issue.setStatus("RESOLVED");
                    }
                    Issue updated = issueRepository.save(issue);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // NEW: Update/Edit an existing issue
    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long id, @RequestBody Issue issueDetails) {
        return issueRepository.findById(id)
                .map(issue -> {
                    issue.setTitle(issueDetails.getTitle());
                    issue.setDescription(issueDetails.getDescription());
                    issue.setCategory(issueDetails.getCategory());
                    issue.setPriority(issueDetails.getPriority());
                    
                    Issue updatedIssue = issueRepository.save(issue);
                    return ResponseEntity.ok(updatedIssue);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        if (issueRepository.existsById(id)) {
            issueRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}