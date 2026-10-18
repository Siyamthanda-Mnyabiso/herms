package za.ac.cput.herms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.util.Helper;

/**
 * Creates the first admin account from HERMS_ADMIN_EMAIL / HERMS_ADMIN_PASSWORD.
 * Does nothing when either is unset or the account already exists.
 */
@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final String email;
    private final String password;

    public AdminAccountInitializer(AccountRepository accountRepository,
                                   @Value("${herms.admin.email:}") String email,
                                   @Value("${herms.admin.password:}") String password) {
        this.accountRepository = accountRepository;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() || password.isBlank() || accountRepository.existsByEmail(email)) {
            return;
        }
        accountRepository.save(new Account(email, Helper.hashPassword(password), "admin", "admin"));
    }
}
