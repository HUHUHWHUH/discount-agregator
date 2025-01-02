package com.fiji.qrcodeservice.services;

import com.fiji.qrcodeservice.qr.QrCodeGenerator;
import com.google.zxing.WriterException;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class QrCodeService {

    private final JwtService jwtService;

    public QrCodeService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public byte[] generateQrCodeForUser(String email) throws WriterException, IOException {
        String token = jwtService.generateToken(email);  // Генерируем токен на основе email
        return QrCodeGenerator.generateQrCode(token, 300, 300);
    }

    public byte[] generateQrCode(String email) {
        String localUrl = "http://localhost:4200/user-profile?email=" + email;
        try {
            return QrCodeGenerator.getQRCodeImage(localUrl, 200, 200);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при генерации QR-кода", e);
        }
    }
}
