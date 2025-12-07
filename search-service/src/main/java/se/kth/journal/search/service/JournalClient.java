package se.kth.journal.search.service;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.enterprise.context.Dependent;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Dependent
@RegisterRestClient(configKey = "journal-client")
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public interface JournalClient {

    @GET
    @Path("/patients")
    String getAllPatients();

    @GET
    @Path("/patients/{id}")
    String getPatient(@PathParam("id") Long id);

    @GET
    @Path("/conditions/patient/{id}")
    String getConditionsByPatient(@PathParam("id") Long patientId);

    @GET
    @Path("/practitioners")
    String getAllPractitioners();

    @GET
    @Path("/encounters/practitioner/{id}")
    String getEncountersByPractitioner(
            @PathParam("id") Long practitionerId,
            @QueryParam("date") String date
    );
}
