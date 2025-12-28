package se.kth.journal.search.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/")
public class RootResource {

    @GET
    public String ok() {
        return "OK";
    }
}
