package se.kth.journal.search.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import io.smallrye.mutiny.Uni;

import se.kth.journal.search.dto.PatientDTO;
import se.kth.journal.search.dto.PractitionerDTO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.jboss.logging.Logger;

@ApplicationScoped
public class MyRemoteService {

    private static final Logger LOG = Logger.getLogger(MyRemoteService.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Inject
    @RestClient
    JournalClient journalClient;


    public Uni<List<PatientDTO>> searchPatientsByName(String query) {
        final String q = query == null ? "" : query.toLowerCase();

        return journalClient.getAllPatients()
                .onItem().transform(json -> {
                    try {
                        JsonNode arr = MAPPER.readTree(json);
                        if (arr == null || !arr.isArray()) return List.of();

                        List<PatientDTO> out = new ArrayList<>();

                        for (JsonNode p : arr) {
                            String first = p.path("firstName").asText("");
                            String last = p.path("lastName").asText("");
                            String username = p.path("username").asText("");
                            String full = (first + " " + last + " " + username).toLowerCase();

                            if (full.contains(q)) {
                                out.add(new PatientDTO(
                                        p.path("id").asLong(),
                                        first,
                                        last,
                                        p.path("email").asText("")
                                ));
                            }
                        }
                        return out;

                    } catch (Exception e) {
                        LOG.error("searchPatientsByName failed", e);
                        return List.of();
                    }
                });
    }


    public Uni<List<PatientDTO>> searchPatientsByCondition(String condition) {
        if (condition == null || condition.isBlank()) {
            return Uni.createFrom().item(List::of);
        }

        final String q = condition.toLowerCase();

        return searchPatientsByName("")
                .onItem().transformToUni(patients -> {

                    List<Uni<Optional<PatientDTO>>> checks =
                            patients.stream()
                                    .map(p ->
                                            journalClient.getConditionsByPatient(p.id)
                                                    .onItem().transform(json -> {
                                                        try {
                                                            JsonNode arr = MAPPER.readTree(json);
                                                            if (arr != null && arr.isArray()) {
                                                                for (JsonNode c : arr) {
                                                                    String diag = c.path("diagnosis").asText("").toLowerCase();
                                                                    if (diag.contains(q)) {
                                                                        return Optional.of(p);
                                                                    }
                                                                }
                                                            }
                                                        } catch (Exception ignore) {}
                                                        return Optional.<PatientDTO>empty();
                                                    })
                                    )
                                    .toList();

                    // NYA KORREKTA SÄTTET
                    return Uni.join().all(checks)
                            .andCollectFailures()
                            .map(list ->
                                    list.stream()
                                            .flatMap(Optional::stream)
                                            .collect(Collectors.toList())
                            );
                });
    }





    public Uni<List<PractitionerDTO>> getAllPractitioners() {
        return journalClient.getAllPractitioners()
                .onItem().transform(json -> {
                    try {
                        JsonNode arr = MAPPER.readTree(json);
                        if (arr == null || !arr.isArray()) return List.of();

                        List<PractitionerDTO> out = new ArrayList<>();

                        for (JsonNode p : arr) {
                            out.add(new PractitionerDTO(
                                    p.path("id").asLong(),
                                    p.path("firstName").asText(""),
                                    p.path("lastName").asText(""),
                                    p.path("email").asText("")
                            ));
                        }
                        return out;

                    } catch (Exception e) {
                        LOG.error("getAllPractitioners failed", e);
                        return List.of();
                    }
                });
    }

    public Uni<List<PatientDTO>> searchPatientsByPractitioner(Long practitionerId) {

        return journalClient.getEncountersByPractitioner(practitionerId, null)
                .onItem().transformToUni(json -> {
                    try {
                        JsonNode arr = MAPPER.readTree(json);
                        if (arr == null || !arr.isArray()) {
                            return Uni.createFrom().item(List::of);
                        }

                        Set<Long> patientIds = new HashSet<>();
                        for (JsonNode e : arr) {
                            patientIds.add(e.path("patientId").asLong());
                        }

                        return searchPatientsByName("")
                                .onItem().transform(all ->
                                        all.stream()
                                                .filter(p -> patientIds.contains(p.id))
                                                .collect(Collectors.toList())
                                );

                    } catch (Exception e) {
                        LOG.error("searchPatientsByPractitioner failed", e);
                        return Uni.createFrom().item(List::of);
                    }
                });
    }


    public Uni<String> getEncountersForPractitionerOnDate(Long id, LocalDate date) {
        return journalClient.getEncountersByPractitioner(
                        id,
                        date == null ? null : date.toString()
                )
                .onFailure().invoke(err ->
                        LOG.errorf(err, "Failed fetching encounters for practitioner %s", id)
                )
                .onFailure().recoverWithItem("[]");
    }
}
