package se.kth.journal.search.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PractitionerDTO {

    public Long id;
    public String firstName;
    public String lastName;
    public String email;

    public PractitionerDTO() {}

    public PractitionerDTO(Long id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
