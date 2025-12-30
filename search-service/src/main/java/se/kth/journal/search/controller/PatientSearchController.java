package se.kth.journal.search.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import se.kth.journal.search.service.MyRemoteService;

import io.smallrye.mutiny.Uni;

import java.time.LocalDate;

@Path("/search")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PatientSearchController {

    @Inject
    MyRemoteService remote;

    // ==================================================
    // GET /search/patients
    // Roles: doctor, staff
    // ==================================================
    @GET
    @Path("/patients")
    @RolesAllowed({"doctor", "staff"})
    public Uni<Response> searchPatients(@QueryParam("query") String query,
                                        @QueryParam("condition") String condition) {

        if (condition != null && !condition.isBlank()) {
            return remote.searchPatientsByCondition(condition)
                    .map(result -> Response.ok(result).build());
        }

        return remote.searchPatientsByName(query)
                .map(result -> Response.ok(result).build());
    }

    // ==================================================
    // GET /search/practitioners
    // Roles: doctor, staff
    // ==================================================
    @GET
    @Path("/practitioners")
    @RolesAllowed({"doctor", "staff"})
    public Uni<Response> allPractitioners() {
        return remote.getAllPractitioners()
                .map(result -> Response.ok(result).build());
    }

    // ==================================================
    // GET /search/practitioners/{id}/patients
    // Roles: doctor, staff
    // ==================================================
    @GET
    @Path("/practitioners/{id}/patients")
    @RolesAllowed({"doctor", "staff"})
    public Uni<Response> patientsByPractitioner(@PathParam("id") Long id) {
        return remote.searchPatientsByPractitioner(id)
                .map(result -> Response.ok(result).build());
    }

    // ==================================================
    // GET /search/practitioners/{id}/encounters
    // Roles: doctor only
    // ==================================================
    @GET
    @Path("/practitioners/{id}/encounters")
    @RolesAllowed("doctor")
    public Uni<Response> encounters(@PathParam("id") Long practitionerId,
                                    @QueryParam("date") String date) {

        LocalDate d = date == null || date.isBlank()
                ? null
                : LocalDate.parse(date);

        return remote.getEncountersForPractitionerOnDate(practitionerId, d)
                .map(result -> Response.ok(result).build());
    }
}
