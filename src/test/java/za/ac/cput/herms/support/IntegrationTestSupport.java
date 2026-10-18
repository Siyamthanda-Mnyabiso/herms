package za.ac.cput.herms.support;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.MailService;
import za.ac.cput.herms.util.Helper;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Boots the whole application (against the test database) and drives it over HTTP with MockMvc.
 * Every test creates its own uniquely-named accounts, so tests do not depend on each other.
 * MailService is mocked so no email is ever sent and reset links can be read back.
 */
@SpringBootTest
@AutoConfigureMockMvc
public abstract class IntegrationTestSupport {

    public static final String PASSWORD = "password123";

    /** A logged-in test user. */
    public record Session(String email, String password, String token, String refId) {
    }

    @Autowired
    protected MockMvc mvc;
    @Autowired
    protected ObjectMapper json;
    @Autowired
    protected AccountRepository accounts;
    @Autowired
    protected JdbcTemplate jdbc;

    @MockitoBean
    protected MailService mailService;

    @BeforeEach
    void resetMocks() {
        org.mockito.Mockito.clearInvocations(mailService);
    }

    // ---- request helpers -------------------------------------------------

    protected static String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }

    protected static String inDays(int days) {
        return LocalDate.now().plusDays(days).toString();
    }

    protected MockHttpServletRequestBuilder withToken(MockHttpServletRequestBuilder request, String token) {
        return token == null ? request : request.header("Authorization", "Bearer " + token);
    }

    protected ResultActions postJson(String url, String token, Object body) throws Exception {
        MockHttpServletRequestBuilder request = post(url).contentType(MediaType.APPLICATION_JSON)
                .content(body instanceof String s ? s : json.writeValueAsString(body));
        return mvc.perform(withToken(request, token));
    }

    protected ResultActions getJson(String url, String token) throws Exception {
        return mvc.perform(withToken(get(url), token));
    }

    protected JsonNode body(ResultActions result) throws Exception {
        MvcResult mvcResult = result.andReturn();
        return json.readTree(mvcResult.getResponse().getContentAsString());
    }

    protected String text(ResultActions result) throws Exception {
        return result.andReturn().getResponse().getContentAsString();
    }

    // ---- account helpers -------------------------------------------------

    protected int loginStatus(String email, String password) throws Exception {
        return postJson("/auth/login", null, Map.of("email", email, "password", password))
                .andReturn().getResponse().getStatus();
    }

    protected Session login(String email, String password) throws Exception {
        JsonNode response = body(postJson("/auth/login", null, Map.of("email", email, "password", password))
                .andExpect(status().isOk()));
        return new Session(email, password, response.get("token").asString(), response.get("refId").asString());
    }

    /** Registers an available nurse through the public API and returns the logged-in session. */
    protected Session newProfessional() throws Exception {
        String email = uniqueEmail("nurse");
        postJson("/auth/register/professional", null, Map.of(
                "role", "nurse", "firstName", "Thandi", "lastName", "Nkosi", "email", email,
                "phoneNumber", "0821234567", "password", PASSWORD, "licenseNo", "12345678"))
                .andExpect(status().isCreated());
        return login(email, PASSWORD);
    }

    protected Map<String, String> organizationRegistration(String email, String role) {
        return Map.ofEntries(
                Map.entry("role", role), Map.entry("organizationName", "Test " + role),
                Map.entry("email", email), Map.entry("phoneNumber", "0831234567"),
                Map.entry("password", PASSWORD), Map.entry("streetName", "1 Main Rd"),
                Map.entry("postalCode", "8001"), Map.entry("city", "Cape Town"),
                Map.entry("province", "Western Cape"), Map.entry("organizationType", "General"),
                Map.entry("sector", "Public"), Map.entry("schoolLevel", "Primary"));
    }

    /** Registers a hospital, approves it directly in the database, and returns its logged-in session. */
    protected Session newActiveOrganization() throws Exception {
        String email = uniqueEmail("org");
        postJson("/auth/register/organization", null, organizationRegistration(email, "hospital"))
                .andExpect(status().isAccepted());
        approve(email);
        return login(email, PASSWORD);
    }

    protected void approve(String email) {
        Account account = accounts.findByEmail(email).orElseThrow();
        account.setStatus(Account.STATUS_ACTIVE);
        accounts.save(account);
    }

    protected Session newAdmin() throws Exception {
        String email = uniqueEmail("admin");
        accounts.save(new Account(email, Helper.hashPassword(PASSWORD), "admin", "admin"));
        return login(email, PASSWORD);
    }

    protected void makeUnavailable(Session professional) {
        jdbc.update("UPDATE nurse SET availability_status = 'NOT_AVAILABLE' WHERE person_id = ?",
                Long.valueOf(professional.refId()));
    }
}
