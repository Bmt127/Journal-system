package se.kth.journal.search.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;

import se.kth.journal.search.service.MyRemoteService;

import io.smallrye.mutiny.Uni;

import java.time.LocalDate;

@Path("/search")
@Produces(MediaType.APPLICATION_JSON)
public class PatientSearchController {

    @Inject
    MyRemoteService remote;

    // -------------------------------
    // GET /search/patients
    // -------------------------------
    @GET
    @Path("/patients")
    public Uni<Response> searchPatients(@QueryParam("query") String query,
                                        @QueryParam("condition") String condition) {

        if (condition != null && !condition.isBlank()) {
            return remote.searchPatientsByCondition(condition)
                    .map(result -> Response.ok(result).build());
        }

        return remote.searchPatientsByName(query)
                .map(result -> Response.ok(result).build());
    }

    // -------------------------------
    // GET /search/practitioners
    // -------------------------------
    @GET
    @Path("/practitioners")
    public Uni<Response> allPractitioners() {
        return remote.getAllPractitioners()
                .map(result -> Response.ok(result).build());
    }

    // -------------------------------
    // GET /search/practitioners/{id}/patients
    // -------------------------------
    @GET
    @Path("/practitioners/{id}/patients")
    public Uni<Response> patientsByPractitioner(@PathParam("id") Long id) {
        return remote.searchPatientsByPractitioner(id)
                .map(result -> Response.ok(result).build());
    }

    // -------------------------------
    // GET /search/practitioners/{id}/encounters
    // -------------------------------
    @GET
    @Path("/practitioners/{id}/encounters")
    public Uni<Response> encounters(@PathParam("id") Long practitionerId,
                                    @QueryParam("date") String date) {

        LocalDate d = date == null ? null : LocalDate.parse(date);

        return remote.getEncountersForPractitionerOnDate(practitionerId, d)
                .map(result -> Response.ok(result).build());
    }
}
