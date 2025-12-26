package se.kth.journal.journalservice;

import org.junit.jupiter.api.Test;
import se.kth.journal.journalservice.entity.Patient;

import static org.junit.jupiter.api.Assertions.assertEquals;
// Importen nedan beror på var din Patient-klass ligger, t.ex:
// import se.kth.journal.journalservice.model.Patient;

public class PatientTest {

    @Test
    void testPatientName() {
        Patient p = new Patient();
        p.setName("Bemnet");
        assertEquals("Bemnet", p.getName());
    }
}