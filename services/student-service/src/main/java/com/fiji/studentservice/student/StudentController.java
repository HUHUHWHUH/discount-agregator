package com.fiji.studentservice.student;

import com.fiji.studentservice.student.StudentDTO;
import com.fiji.studentservice.student.OfferDTO;
import com.fiji.studentservice.student.Offer;
import com.fiji.studentservice.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public String GetQuery(){
        return "Get Query";
    }

    @PostMapping("/signup")
    public ResponseEntity<StudentDTO> signup(@RequestBody StudentDTO studentDTO) {
        StudentDTO createdStudent = studentService.registerStudent(studentDTO);
        return ResponseEntity.ok(createdStudent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{studentId}/favorite-offers")
    public ResponseEntity<Void> addFavoriteOffer(@PathVariable Long studentId, @RequestBody Offer offer) {
        studentService.addFavoriteOffer(studentId, offer);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{studentId}/favorite-offers")
    public ResponseEntity<Set<Offer>> getFavoriteOffers(@PathVariable Long studentId) {
        Set<Offer> favoriteOffers = studentService.getFavoriteOffers(studentId);
        return ResponseEntity.ok(favoriteOffers);
    }
}
