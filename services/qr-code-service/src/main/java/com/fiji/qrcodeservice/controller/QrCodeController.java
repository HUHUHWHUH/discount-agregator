package com.fiji.qrcodeservice.controller;

import com.fiji.qrcodeservice.qr.QrCodeGenerator;
import com.fiji.qrcodeservice.services.QrCodeService;
import com.google.zxing.WriterException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/qr")
public class QrCodeController {

    private final QrCodeService qrCodeService;

    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

//    @GetMapping("/email/{email}")
//    public ResponseEntity<byte[]> generateQrCode(@PathVariable String email) {
//        try {
//            byte[] qrCode = qrCodeService.generateQrCodeForUser(email);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qrcode.png\"")
//                    .contentType(MediaType.IMAGE_PNG)
//                    .body(qrCode);
//        } catch (WriterException | IOException e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }

    private static final String USER_PROFILE_URL = "http://localhost:4200/user-information/";

    @GetMapping("/generate")
    public ResponseEntity<ByteArrayResource> generateQRCode(@RequestParam String email) throws Exception {
        // Генерация ссылки на страницу с данными пользователя
        String qrCodeData = USER_PROFILE_URL + email;

        // Генерация QR-кода
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        QrCodeGenerator.getQRCodeImage(qrCodeData, 350, 350, outputStream);

        // Возврат QR-кода в виде изображения
        ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }

//    @GetMapping("/generate")
//    public ResponseEntity<byte[]> generateQrCode(@RequestParam String data) {
//        try {
//            byte[] qrCodeImage = QrCodeGenerator.getQRCodeImage(data, 200, 200);
//
//            return ResponseEntity
//                    .ok()
//                    .contentType(MediaType.IMAGE_PNG)
//                    .body(qrCodeImage);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
}
