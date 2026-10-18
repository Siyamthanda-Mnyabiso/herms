package za.ac.cput.herms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Hibernate's "update" mode never changes existing constraints. Databases created before the
 * booking workflow have a CHECK limiting bookings.status to 0..3, which rejects the newer
 * statuses (ACCEPTED, DECLINED, EXPIRED). Drops that constraint once; does nothing otherwise.
 */
@Component
@Order(0)
public class BookingSchemaMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(BookingSchemaMigration.class);

    private final JdbcTemplate jdbc;

    public BookingSchemaMigration(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        try {
            var outdated = jdbc.queryForList("""
                    SELECT tc.CONSTRAINT_NAME AS name
                    FROM information_schema.TABLE_CONSTRAINTS tc
                    JOIN information_schema.CHECK_CONSTRAINTS cc
                      ON cc.CONSTRAINT_SCHEMA = tc.CONSTRAINT_SCHEMA AND cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
                    WHERE tc.TABLE_SCHEMA = DATABASE() AND tc.TABLE_NAME = 'bookings'
                      AND tc.CONSTRAINT_TYPE = 'CHECK' AND cc.CHECK_CLAUSE LIKE '%between 0 and 3%'
                    """, String.class);
            for (String name : outdated) {
                jdbc.execute("ALTER TABLE bookings DROP CHECK `" + name + "`");
                log.info("Dropped outdated bookings status constraint {}", name);
            }
        } catch (RuntimeException e) {
            log.warn("Could not check bookings status constraint: {}", e.getMessage());
        }
    }
}
