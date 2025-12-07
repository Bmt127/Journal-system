package se.kth.journal.search.dto;

public class PatientDTO {
    public Long id;
    public String firstName;
    public String lastName;
    public String email;

    public PatientDTO() {}

    public PatientDTO(Long id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
