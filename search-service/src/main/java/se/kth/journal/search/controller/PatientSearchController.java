package se.kth.journal.search.controller;

import io.smallrye.common.annotation.Blocking;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;

import se.kth.journal.search.service.MyRemoteService;

import java.time.LocalDate;

@Path("/search")
@Produces(MediaType.APPLICATION_JSON)
@Blocking
public class PatientSearchController {

    @Inject
    MyRemoteService remote;

    // -------------------------------
    // GET /search/patients
    // -------------------------------
    @GET
    @Path("/patients")
    public Response searchPatients(@QueryParam("query") String query,
                                   @QueryParam("condition") String condition) {

        if (condition != null && !condition.isBlank()) {
            return Response.ok(remote.searchPatientsByCondition(condition)).build();
        }
        return Response.ok(remote.searchPatientsByName(query)).build();
    }

    // -------------------------------
    // GET /search/practitioners  <-- NY!!
    // -------------------------------
    @GET
    @Path("/practitioners")
    public Response allPractitioners() {
        return Response.ok(remote.getAllPractitioners()).build();
    }

    // -------------------------------
    // GET /search/practitioners/{id}/patients
    // -------------------------------
    @GET
    @Path("/practitioners/{id}/patients")
    public Response patientsByPractitioner(@PathParam("id") Long id) {
        return Response.ok(remote.searchPatientsByPractitioner(id)).build();
    }

    // -------------------------------
    // GET /search/practitioners/{id}/encounters
    // -------------------------------
    @GET
    @Path("/practitioners/{id}/encounters")
    public Response encounters(@PathParam("id") Long practitionerId,
                               @QueryParam("date") String date) {

        LocalDate d = date == null ? null : LocalDate.parse(date);
        return Response.ok(remote.getEncountersForPractitionerOnDate(practitionerId, d)).build();
    }
}
