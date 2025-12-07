package se.kth.journal.journalservice.dto;

import lombok.Data;

@Data
public class CreateObservationRequest {
    private Long patientId;
    private String note;
}
