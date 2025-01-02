package com.fiji.studentservice.student;

import com.fiji.studentservice.student.StudentDTO;
import com.fiji.studentservice.student.OfferDTO;
import com.fiji.studentservice.student.Student;
import com.fiji.studentservice.student.Offer;
import com.fiji.studentservice.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentDTO registerStudent(StudentDTO studentDTO) {
        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setPassword(studentDTO.getPassword());
        Student savedStudent = studentRepository.save(student);
        studentDTO.setId(savedStudent.getId());
        return studentDTO;
    }

    public Optional<StudentDTO> getStudentById(Long id) {
        return studentRepository.findById(id).map(student -> {
            StudentDTO dto = new StudentDTO();
            dto.setId(student.getId());
            dto.setName(student.getName());
            dto.setEmail(student.getEmail());
            return dto;
        });
    }

    public void addFavoriteOffer(Long studentId, Offer offer) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        studentOpt.ifPresent(student -> {
            student.getFavoriteOffers().add(offer);
            studentRepository.save(student);
        });
    }

    public Set<Offer> getFavoriteOffers(Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        return studentOpt.map(Student::getFavoriteOffers).orElse(null);
    }
}
