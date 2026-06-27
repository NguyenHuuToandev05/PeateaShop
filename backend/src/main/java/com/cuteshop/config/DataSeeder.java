package com.cuteshop.config;

import com.cuteshop.entity.*;
import com.cuteshop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("🌸 Seeding database...");

        // ── Admin user ────────────────────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .fullName("Admin").email("admin@squishyheaven.ph")
                .password(passwordEncoder.encode("admin123"))
                .phone("09000000000").role(User.Role.ADMIN).build());

        // ── Sample customer ───────────────────────────────────────────────────
        userRepository.save(User.builder()
                .fullName("Maria Santos").email("maria@email.com")
                .password(passwordEncoder.encode("password"))
                .phone("09171234567").role(User.Role.CUSTOMER).build());

        // ── Categories ────────────────────────────────────────────────────────
        Category squishy = categoryRepository.save(Category.builder()
                .name("Squishy").description("Slow-rising squishies for stress relief").build());
        Category plushie = categoryRepository.save(Category.builder()
                .name("Plushie").description("Super soft plush toys").build());
        Category stationery = categoryRepository.save(Category.builder()
                .name("Stationery").description("Cute stationery and collectibles").build());

        // ── Products ──────────────────────────────────────────────────────────
        productRepository.saveAll(List.of(
                Product.builder()
                        .name("Strawberry Mochi Squishy").category(squishy)
                        .description("Super slow-rising strawberry mochi squishy! Made from premium memory foam, scented with a sweet strawberry fragrance. Perfect for stress relief and collection!")
                        .price(BigDecimal.valueOf(189)).stock(24)
                        .imageUrls(List.of(
                                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
                                "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=600"))
                        .variants(List.of("Pink", "Yellow", "Mint"))
                        .newArrival(true).featured(true).soldCount(128).build(),

                Product.builder()
                        .name("Bunny Plushie Pillow").category(plushie)
                        .description("Ultra-soft bunny plushie pillow, perfect for hugging and decorating your room. Made from premium plush material.")
                        .price(BigDecimal.valueOf(349)).stock(12)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=600"))
                        .variants(List.of())
                        .newArrival(false).featured(true).soldCount(94).build(),

                Product.builder()
                        .name("Rainbow Cat Figurine Set").category(squishy)
                        .description("Adorable set of 6 colorful cat figurines. Each one is unique with a different color and expression!")
                        .price(BigDecimal.valueOf(420)).stock(8)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600"))
                        .variants(List.of())
                        .newArrival(true).featured(true).soldCount(47).build(),

                Product.builder()
                        .name("Teddy Bear Plush Buddy").category(plushie)
                        .description("Classic teddy bear with the softest fur you've ever felt. Perfect gift for all ages!")
                        .price(BigDecimal.valueOf(280)).stock(0)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600"))
                        .variants(List.of())
                        .newArrival(false).featured(true).soldCount(203).active(true).build(),

                Product.builder()
                        .name("Fox Kitsune Mask Set").category(stationery)
                        .description("Beautiful set of decorative fox masks. Perfect for room decoration and collection.")
                        .price(BigDecimal.valueOf(350)).stock(15)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600"))
                        .variants(List.of())
                        .newArrival(true).featured(false).soldCount(30).build(),

                Product.builder()
                        .name("Cloud Pillow Squishy").category(squishy)
                        .description("Soft and squishy cloud-shaped pillow. Squeeze it for instant stress relief!")
                        .price(BigDecimal.valueOf(199)).stock(5)
                        .imageUrls(List.of("https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=600"))
                        .variants(List.of("White", "Pink", "Blue"))
                        .newArrival(false).featured(false).soldCount(60).build()
        ));

        log.info("✅ Database seeded! Admin: admin@squishyheaven.ph / admin123");
    }
}
