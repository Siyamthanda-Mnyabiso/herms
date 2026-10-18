package za.ac.cput.herms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.dto.BookingRequestPayload;
import za.ac.cput.herms.dto.BookingView;
import za.ac.cput.herms.dto.ReasonPayload;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.AuditLogService;
import za.ac.cput.herms.service.BookingWorkflowException;
import za.ac.cput.herms.service.BookingWorkflowService;

import java.util.List;

/** Role rules are in SecurityConfig; ownership is checked in BookingWorkflowService. */
@RestController
@RequestMapping("/booking-requests")
public class BookingRequestController {

    private final BookingWorkflowService workflow;
    private final AccountRepository accounts;
    private final AuditLogService auditLog;

    @Autowired
    public BookingRequestController(BookingWorkflowService workflow, AccountRepository accounts, AuditLogService auditLog) {
        this.workflow = workflow;
        this.accounts = accounts;
        this.auditLog = auditLog;
    }

    @GetMapping("/mine")
    public List<BookingView> mine() {
        return workflow.mine(current());
    }

    @PostMapping
    public ResponseEntity<BookingView> request(@RequestBody BookingRequestPayload body) {
        Account org = current();
        BookingView created = workflow.request(org, body.getPersonId(), body.getStartDate(), body.getEndDate());
        auditLog.record(org.getEmail(), "BOOKING_REQUESTED", "booking:" + created.id(), "professional=" + body.getPersonId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/accept")
    public BookingView accept(@PathVariable Long id) {
        Account pro = current();
        BookingView view = workflow.accept(pro, id);
        auditLog.record(pro.getEmail(), "BOOKING_ACCEPTED", "booking:" + id, null);
        return view;
    }

    @PostMapping("/{id}/decline")
    public BookingView decline(@PathVariable Long id, @RequestBody(required = false) ReasonPayload body) {
        Account pro = current();
        BookingView view = workflow.decline(pro, id, body == null ? null : body.getReason());
        auditLog.record(pro.getEmail(), "BOOKING_DECLINED", "booking:" + id, null);
        return view;
    }

    @PostMapping("/{id}/confirm")
    public BookingView confirm(@PathVariable Long id) {
        Account org = current();
        BookingView view = workflow.confirm(org, id);
        auditLog.record(org.getEmail(), "BOOKING_CONFIRMED", "booking:" + id, null);
        return view;
    }

    @PostMapping("/{id}/cancel")
    public BookingView cancel(@PathVariable Long id, @RequestBody(required = false) ReasonPayload body) {
        Account org = current();
        BookingView view = workflow.cancel(org, id, body == null ? null : body.getReason());
        auditLog.record(org.getEmail(), "BOOKING_CANCELED", "booking:" + id, null);
        return view;
    }

    @ExceptionHandler(BookingWorkflowException.class)
    public ResponseEntity<String> handle(BookingWorkflowException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    private Account current() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return accounts.findByEmail(email)
                .orElseThrow(() -> new BookingWorkflowException(HttpStatus.UNAUTHORIZED, "Not signed in"));
    }
}
