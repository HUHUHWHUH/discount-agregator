package com.fiji.studentservice.student;


import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students_db")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password; // Не забудь использовать шифрование паролей!

    @ManyToMany(cascade = {CascadeType.ALL})
    @JoinTable(
            name = "student_favorite_offers",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "offer_id")
    )
    private Set<Offer> favoriteOffers = new HashSet<>();

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Offer> getFavoriteOffers() {
        return favoriteOffers;
    }

    public void setFavoriteOffers(Set<Offer> favoriteOffers) {
        this.favoriteOffers = favoriteOffers;
    }
}
