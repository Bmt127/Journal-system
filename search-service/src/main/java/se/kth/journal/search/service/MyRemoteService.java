package se.kth.journal.search.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import se.kth.journal.search.dto.PatientDTO;
import se.kth.journal.search.dto.PractitionerDTO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.jboss.logging.Logger;

import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;

@ApplicationScoped
public class MyRemoteService {

    private static final Logger LOG = Logger.getLogger(MyRemoteService.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Inject
    @RestClient
    JournalClient journalClient;

    // ----------------------------
    // PATIENT SEARCH BY NAME
    // ----------------------------
    public Uni<List<PatientDTO>> searchPatientsByName(String query) {
        return Uni.createFrom().item(() -> {
            try {
                String json = journalClient.getAllPatients();

                JsonNode arr = MAPPER.readTree(json);
                if (!arr.isArray()) return List.of();

                String q = query == null ? "" : query.toLowerCase();
                List<PatientDTO> out = new ArrayList<>();

                for (JsonNode p : arr) {
                    Long id = p.path("id").asLong();
                    String first = p.path("firstName").asText("");
                    String last = p.path("lastName").asText("");
                    String email = p.path("email").asText("");
                    String username = p.path("username").asText("");

                    String full = (first + " " + last + " " + username).toLowerCase();

                    if (full.contains(q)) {
                        out.add(new PatientDTO(id, first, last, email));
                    }
                }
                return out;

            } catch (Exception e) {
                LOG.error("searchPatientsByName failed", e);
                return List.of();
            }
        }).runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }

    // ----------------------------
    // SEARCH BY CONDITION
    // ----------------------------
    public Uni<List<PatientDTO>> searchPatientsByCondition(String condition) {
        if (condition == null || condition.isBlank()) {
            return Uni.createFrom().item(List.of());
        }

        String q = condition.toLowerCase();

        return searchPatientsByName("")
                .map(patients ->
                        patients.stream().filter(p -> {
                            try {
                                String condJson = journalClient.getConditionsByPatient(p.id);
                                JsonNode arr = MAPPER.readTree(condJson);

                                for (JsonNode c : arr) {
                                    String diag = c.path("diagnosis").asText("").toLowerCase();
                                    if (diag.contains(q)) return true;
                                }
                            } catch (Exception ignored) {}
                            return false;
                        }).collect(Collectors.toList())
                )
                .runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }

    // ----------------------------
    // GET ALL PRACTITIONERS
    // ----------------------------
    public Uni<List<PractitionerDTO>> getAllPractitioners() {
        return Uni.createFrom().item(() -> {
            try {
                String json = journalClient.getAllPractitioners();
                JsonNode arr = MAPPER.readTree(json);

                List<PractitionerDTO> out = new ArrayList<>();

                for (JsonNode p : arr) {
                    Long id = p.path("id").asLong();
                    String first = p.path("firstName").asText("");
                    String last = p.path("lastName").asText("");
                    String email = p.path("email").asText("");

                    out.add(new PractitionerDTO(id, first, last, email));
                }

                return out;

            } catch (Exception e) {
                LOG.error("getAllPractitioners failed", e);
                return List.of();
            }
        }).runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }

    // ----------------------------
    // PRACTITIONER → PATIENT LIST
    // ----------------------------
    public Uni<List<PatientDTO>> searchPatientsByPractitioner(Long practitionerId) {
        return Uni.createFrom().item(() -> {
            try {
                String json = journalClient.getEncountersByPractitioner(practitionerId, null);
                JsonNode arr = MAPPER.readTree(json);
                if (!arr.isArray()) return List.of();

                Set<Long> ids = new HashSet<>();
                for (JsonNode e : arr) {
                    ids.add(e.path("patientId").asLong());
                }

                String patientsJson = journalClient.getAllPatients();
                JsonNode patientsArr = MAPPER.readTree(patientsJson);

                List<PatientDTO> out = new ArrayList<>();

                for (JsonNode p : patientsArr) {
                    Long id = p.path("id").asLong();
                    if (ids.contains(id)) {
                        out.add(new PatientDTO(
                                id,
                                p.path("firstName").asText(""),
                                p.path("lastName").asText(""),
                                p.path("email").asText("")
                        ));
                    }
                }

                return out;

            } catch (Exception e) {
                LOG.error("searchPatientsByPractitioner failed", e);
                return List.of();
            }
        }).runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }

    // ----------------------------
    // PRACTITIONER ENCOUNTERS BY DATE
    // ----------------------------
    public Uni<String> getEncountersForPractitionerOnDate(Long id, LocalDate date) {
        return Uni.createFrom().item(() -> {
            try {
                return journalClient.getEncountersByPractitioner(
                        id,
                        date == null ? null : date.toString()
                );
            } catch (Exception e) {
                LOG.error("getEncountersForPractitionerOnDate failed", e);
                return "[]";
            }
        }).runSubscriptionOn(Infrastructure.getDefaultWorkerPool());
    }
}
