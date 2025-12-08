package se.kth.journal.search.service;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import io.smallrye.mutiny.Uni;

@RegisterRestClient
public interface JournalClient {

    @GET
    @Path("/patients")
    Uni<String> getAllPatients();

    @GET
    @Path("/patients/{id}/conditions")
    Uni<String> getConditionsByPatient(@PathParam("id") Long id);

    @GET
    @Path("/practitioners")
    Uni<String> getAllPractitioners();

    @GET
    @Path("/practitioners/{id}/encounters")
    Uni<String> getEncountersByPractitioner(@PathParam("id") Long id,
                                            @QueryParam("date") String date);
}
