package za.ac.cput.herms.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpMethod;
import za.ac.cput.herms.support.IntegrationTestSupport;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SecurityIntegrationTest extends IntegrationTestSupport {

    @ParameterizedTest(name = "{0} {1} without a token is 401")
    @CsvSource({
            "GET,/staff/nurse/all",
            "GET,/booking-requests/mine",
            "POST,/booking-requests",
            "POST,/booking-requests/1/accept",
            "GET,/admin/users",
            "GET,/admin/organizations",
            "GET,/admin/audit-logs",
            "POST,/admin/admins",
            "GET,/Bookings/getAll",
    })
    void protectedEndpointsRejectAnonymousRequests(String method, String url) throws Exception {
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .request(HttpMethod.valueOf(method), url).contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void garbageAndUnknownTokensAreRejected() throws Exception {
        getJson("/booking-requests/mine", "not-a-real-token").andExpect(status().isUnauthorized());
        getJson("/booking-requests/mine", "").andExpect(status().isUnauthorized());
    }

    @Test
    void loginAndRegistrationAreOpenToAnonymousUsers() throws Exception {
        // Wrong credentials give 401 from the controller; a 403 would mean the endpoint itself is blocked.
        postJson("/auth/login", null, Map.of("email", "nobody@example.com", "password", "whatever1"))
                .andExpect(status().isUnauthorized());
        postJson("/auth/register/professional", null, "{}").andExpect(status().is4xxClientError())
                .andExpect(result -> {
                    int code = result.getResponse().getStatus();
                    if (code == 401 || code == 403) throw new AssertionError("registration is blocked: " + code);
                });
        postJson("/auth/forgot-password", null, Map.of("email", "nobody@example.com")).andExpect(status().isAccepted());
    }

    @Test
    void professionalsAndOrganizationsCannotUseTheAdminApi() throws Exception {
        Session professional = newProfessional();
        Session organization = newActiveOrganization();
        for (String token : new String[]{professional.token(), organization.token()}) {
            getJson("/admin/users", token).andExpect(status().isForbidden());
            getJson("/admin/organizations", token).andExpect(status().isForbidden());
            getJson("/admin/audit-logs", token).andExpect(status().isForbidden());
            postJson("/admin/admins", token, Map.of("email", uniqueEmail("x"), "password", PASSWORD))
                    .andExpect(status().isForbidden());
            getJson("/Bookings/getAll", token).andExpect(status().isForbidden());
        }
    }

    @Test
    void adminsCanUseTheAdminApi() throws Exception {
        Session admin = newAdmin();
        getJson("/admin/users", admin.token()).andExpect(status().isOk());
        getJson("/admin/organizations", admin.token()).andExpect(status().isOk());
        getJson("/admin/audit-logs", admin.token()).andExpect(status().isOk());
        getJson("/Bookings/getAll", admin.token()).andExpect(status().isOk());
    }

    @Test
    void adminsCannotCreateBookingsAsOrganizations() throws Exception {
        Session admin = newAdmin();
        postJson("/booking-requests", admin.token(), Map.of("personId", 1, "startDate", inDays(1), "endDate", inDays(2)))
                .andExpect(status().isForbidden());
    }

    @Test
    void professionalsCannotRequestOrConfirmAndOrganizationsCannotAcceptOrDecline() throws Exception {
        Session professional = newProfessional();
        Session organization = newActiveOrganization();

        postJson("/booking-requests", professional.token(),
                Map.of("personId", professional.refId(), "startDate", inDays(1), "endDate", inDays(2)))
                .andExpect(status().isForbidden());
        postJson("/booking-requests/1/confirm", professional.token(), "{}").andExpect(status().isForbidden());
        postJson("/booking-requests/1/cancel", professional.token(), "{}").andExpect(status().isForbidden());

        postJson("/booking-requests/1/accept", organization.token(), "{}").andExpect(status().isForbidden());
        postJson("/booking-requests/1/decline", organization.token(), "{}").andExpect(status().isForbidden());
    }

    @Test
    void logoutEndsTheSession() throws Exception {
        Session professional = newProfessional();
        getJson("/booking-requests/mine", professional.token()).andExpect(status().isOk());

        mvc.perform(withToken(post("/auth/logout"), professional.token())).andExpect(status().isNoContent());

        getJson("/booking-requests/mine", professional.token()).andExpect(status().isUnauthorized());
    }

    @Test
    void loggingInAgainReplacesTheOldToken() throws Exception {
        Session first = newProfessional();
        Session second = login(first.email(), first.password());

        getJson("/booking-requests/mine", first.token()).andExpect(status().isUnauthorized());
        getJson("/booking-requests/mine", second.token()).andExpect(status().isOk());
    }

    @Test
    void corsAllowsTheFrontendOriginOnly() throws Exception {
        mvc.perform(options("/booking-requests/mine")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));

        mvc.perform(options("/booking-requests/mine")
                        .header("Origin", "http://evil.example")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden());
    }

    @Test
    void protectedEndpointsReturnPlainUnauthorizedNotARedirectToALoginPage() throws Exception {
        mvc.perform(get("/staff/nurse/all"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().doesNotExist("Location"));
    }
}
