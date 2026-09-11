package za.ac.cput.herms.controller;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.repository.CandidateSummary;
import za.ac.cput.herms.service.IStaffService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StaffController.class)
class StaffControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private IStaffService staffService;

    private Nurse nurse() {
        return new Nurse.Builder()
                .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("12345678")
                .build();
    }

    /**
     * A plain implementation for JSON serialization in these tests. A raw Mockito mock of
     * CandidateSummary cannot be safely serialized: Jackson ends up walking Mockito's own
     * internal proxy state instead of just the interface's getters, causing a
     * "non natural depths" parse failure.
     */
    private static final class TestCandidateSummary implements CandidateSummary {
        private final Long personId;
        private final String licenseNo;

        private TestCandidateSummary(Long personId, String licenseNo) {
            this.personId = personId;
            this.licenseNo = licenseNo;
        }

        @Override
        public Long getPersonId() {
            return personId;
        }

        @Override
        public String getQualification() {
            return null;
        }

        @Override
        public String getSpecialization() {
            return null;
        }

        @Override
        public int getYearsOfExperience() {
            return 0;
        }

        @Override
        public String getAvailabilityStatus() {
            return null;
        }

        @Override
        public String getLicenseNo() {
            return licenseNo;
        }

        @Override
        public AddressSummary getAddress() {
            return null;
        }
    }

    // ---------- Nurse ----------

    @Test
    void createNurse_returns201() throws Exception {
        when(staffService.createNurse(any(Nurse.class))).thenReturn(nurse());

        mockMvc.perform(post("/staff/nurse/create")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(nurse())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.licenseNo").value("12345678"));
    }

    @Test
    void getNurse_existingId_returns200() throws Exception {
        when(staffService.getNurseById(1L)).thenReturn(nurse());

        mockMvc.perform(get("/staff/nurse/read/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.licenseNo").value("12345678"));
    }

    @Test
    void getNurse_missingId_returns404() throws Exception {
        when(staffService.getNurseById(99L)).thenReturn(null);

        mockMvc.perform(get("/staff/nurse/read/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllNurses_returnsSummariesNotFullEntity() throws Exception {
        CandidateSummary summary = new TestCandidateSummary(1L, "12345678");
        when(staffService.getAllNurseSummaries()).thenReturn(List.of(summary));

        mockMvc.perform(get("/staff/nurse/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].personId").value(1))
                .andExpect(jsonPath("$[0].licenseNo").value("12345678"))
                .andExpect(jsonPath("$[0].name").doesNotExist())
                .andExpect(jsonPath("$[0].contactDetails").doesNotExist());

        verify(staffService, never()).getAllNurses();
    }

    @Test
    void updateNurse_returns200() throws Exception {
        when(staffService.updateNurse(any(Nurse.class))).thenReturn(nurse());

        mockMvc.perform(put("/staff/nurse/update")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(nurse())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.licenseNo").value("12345678"));
    }

    @Test
    void deleteNurse_returns204() throws Exception {
        mockMvc.perform(delete("/staff/nurse/delete/1"))
                .andExpect(status().isNoContent());

        verify(staffService).deleteNurse(1L);
    }

    @Test
    void isNurseAvailable_returnsServiceResult() throws Exception {
        when(staffService.isNurseAvailable(1L)).thenReturn(true);

        mockMvc.perform(get("/staff/nurse/1/available"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void isNurseLicenseValid_returnsServiceResult() throws Exception {
        when(staffService.isNurseLicenseValid(1L)).thenReturn(false);

        mockMvc.perform(get("/staff/nurse/1/license-valid"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    // ---------- /all summary shape for the other three professional types ----------

    @Test
    void getAllDoctors_returnsSummariesNotFullEntity() throws Exception {
        CandidateSummary summary = new TestCandidateSummary(2L, null);
        when(staffService.getAllDoctorSummaries()).thenReturn(List.of(summary));

        mockMvc.perform(get("/staff/doctor/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].personId").value(2))
                .andExpect(jsonPath("$[0].name").doesNotExist());

        verify(staffService, never()).getAllDoctors();
    }

    @Test
    void getAllTeachers_returnsSummariesNotFullEntity() throws Exception {
        CandidateSummary summary = new TestCandidateSummary(3L, null);
        when(staffService.getAllTeacherSummaries()).thenReturn(List.of(summary));

        mockMvc.perform(get("/staff/teacher/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].personId").value(3))
                .andExpect(jsonPath("$[0].name").doesNotExist());

        verify(staffService, never()).getAllTeachers();
    }

    @Test
    void getAllPharmacists_returnsSummariesNotFullEntity() throws Exception {
        CandidateSummary summary = new TestCandidateSummary(4L, null);
        when(staffService.getAllPharmacistSummaries()).thenReturn(List.of(summary));

        mockMvc.perform(get("/staff/pharmacist/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].personId").value(4))
                .andExpect(jsonPath("$[0].name").doesNotExist());

        verify(staffService, never()).getAllPharmacists();
    }
}
