package za.ac.cput.herms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Sends email through the configured SMTP server. With no SMTP host set (local development)
 * the message is written to the log instead, so the flow can still be tried end to end.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String from;

    public MailService(ObjectProvider<JavaMailSender> mailSender, @Value("${herms.mail.from}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    /** Sends in the background so the caller's response time does not reveal whether an email was sent. */
    public void sendAsync(String to, String subject, String body) {
        CompletableFuture.runAsync(() -> send(to, subject, body));
    }

    private void send(String to, String subject, String body) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            log.warn("SMTP is not configured (SPRING_MAIL_HOST). Email to {} not sent. Subject: {}\n{}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            sender.send(message);
        } catch (RuntimeException e) {
            log.error("Could not send email to {}: {}", to, e.getMessage());
        }
    }
}
