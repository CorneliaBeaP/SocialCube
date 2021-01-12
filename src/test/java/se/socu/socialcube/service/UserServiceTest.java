package se.socu.socialcube.service;

import org.assertj.core.util.IterableUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import se.socu.socialcube.DTO.UserDTO;
import se.socu.socialcube.SocialcubeApplication;
import se.socu.socialcube.entities.Company;
import se.socu.socialcube.entities.Response;
import se.socu.socialcube.entities.UserSocu;
import se.socu.socialcube.entities.Usertype;
import se.socu.socialcube.repository.CompanyRepository;
import se.socu.socialcube.repository.UserRepository;
import se.socu.socialcube.security.jwt.JwtUtil;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    BCryptPasswordEncoder passwordEncoder;

    Company company;
    Company company2;
    UserSocu socuuser;
    UserSocu socuuser2;
    UserSocu socuuser3;
    UserSocu socuuser4;
    UserDTO dto;

    @BeforeEach
    void init() throws IOException {
        passwordEncoder = new BCryptPasswordEncoder();
        company = new Company(5501010101L, "TestCompany AB");
        socuuser = new UserSocu(Usertype.USER, "Anna Svensson", "anna.svensson@testcompany.com", passwordEncoder.encode("aOpTYjdls"), "A007", "IT-avdelningen", company);
        socuuser.setId(1L);
        socuuser2 = new UserSocu(Usertype.ADMIN, "Erik Eriksson", "erik.eriksson@testcompany.com", passwordEncoder.encode("p56GkdoUyyy"), "A008", "IT-avdelningen", company);
        socuuser2.setId(2L);

        company2 = new Company(5502020202L, "TestCompany2 AB");
        socuuser3 = new UserSocu(Usertype.USER, "Angelina Björk", "angelina@testcompany2.com", passwordEncoder.encode("slkdjfSGslri"), "", "Lager", company2);
        socuuser3.setId(3L);
        socuuser4 = new UserSocu(Usertype.ADMIN, "Hans Ek", "hans@testcompany2.com", passwordEncoder.encode("lsgjSJRGlgs1"), "", "Service Desk", company2);
        socuuser4.setId(4L);

        dto = new UserDTO();
        dto.setUsertype(Usertype.USER);
        dto.setName("Caroline Canvas");
        dto.setEmail("caroline.canvas@company.com");
        dto.setEmploymentnumber("U4756");
        dto.setDepartment("Lager");
        dto.setCompanyname(company.getName());
        dto.setCompanyorganizationnumber(company.getOrganizationnumber());

        List<Company> companyList = Arrays.asList(company, company2);
        List<UserSocu> userSocuList = Arrays.asList(socuuser, socuuser2, socuuser3, socuuser4);
        companyRepository.saveAll(companyList);
        userRepository.saveAll(userSocuList);

        Logger logger = Logger.getLogger(UserServiceTest.class.getName());
        for (UserSocu u : userRepository.findAll()
        ) {
            String uid = u.getId() + "";
            logger.log(Level.INFO, uid);
            if(u.getId()>200){
                logger.warning("ID överstiger 200");
            }
        }
    }

    @AfterEach
    void teardown() throws IOException {
        userRepository.deleteAll();
        companyRepository.deleteAll();
        String folder = "client/angularclient/src/assets/ProfilePictures/";
        for (int i = 1; i < 100; i++) {
            String fileName = i + ".png";
            Path path = Paths.get(folder + fileName);
            Files.deleteIfExists(path);
        }
    }

    @Test
    void convertToUserDTOfromUserSocu() {
        UserDTO userDTOconvert = userService.convertToUserDTOfromUserSocu(socuuser);
        assertNotNull(userDTOconvert);
        assertEquals(socuuser.getEmail(), userDTOconvert.getEmail());
        assertEquals(socuuser.getId(), userDTOconvert.getId());
    }

    @Test
    void convertToUserSocuFromUserDTO() {
        UserSocu userSocuconvert = userService.convertToUserSocuFromUserDTO(dto);
        assertNotNull(userSocuconvert);
        assertEquals(dto.getEmail(), userSocuconvert.getEmail());
        assertEquals(dto.getId(), userSocuconvert.getId());
    }

    @Test
    void getAllUserDTOsForCompany() {
        List<UserDTO> list = userService.getAllUserDTOsForCompany(5502020202L);
        assertEquals(2, list.size());
        List<UserDTO> list2 = userService.getAllUserDTOsForCompany(5503030302L);
        assertEquals(0, list2.size());
    }

    @Test
    void saveNewUser() {
        Iterable<UserSocu> iterable = userRepository.findAll();
        List<UserSocu> list = new ArrayList<>();
        for (UserSocu user : iterable
        ) {
            list.add(user);
        }
        assertEquals(4, list.size());
        userService.saveNewUser(dto);
        Iterable<UserSocu> iterable2 = userRepository.findAll();
        List<UserSocu> list2 = new ArrayList<>();
        for (UserSocu user : iterable2
        ) {
            list2.add(user);
        }
        assertEquals(5, list2.size());
        for (UserSocu user : list2
        ) {
            assertNotNull(user);
            assertNotNull(user.getName());
            assertNotNull(user.getEmail());
            if (user.getId() < 1) {
                fail();
            }
        }

        Optional<UserSocu> saveuserSocu = userRepository.findByEmail(dto.getEmail());
        if (saveuserSocu.isEmpty()) {
            fail("Användare har inte sparats korrekt.");
        } else {
            Path path = Paths.get("client/angularclient/src/assets/ProfilePictures/" + saveuserSocu.get().getId() + ".png");
            if (!Files.exists(path)) {
                fail("Ingen sparad profilbild för ny användare");
            }
        }
    }

    @Test
    void deleteUser() {
        Optional<UserSocu> userSocu = userRepository.findByEmail("anna.svensson@testcompany.com");
        Iterable<UserSocu> list = userRepository.findAll();

        userService.deleteUser(userSocu.get().getId());
        assertEquals((IterableUtil.sizeOf(list) - 1), IterableUtil.sizeOf(userRepository.findAll()));

        userSocu = userRepository.findByEmail("anna.svensson@testcompany.com");
        if (userSocu.isPresent()) {
            fail("Borttagning av användare misslyckades");
        }
    }

    @Test
    void saveImage() {
    }

    @Test
    void copyDefaultPictureForNewUser() {
    }

    @Test
    void deleteProfilePicture() {
    }

    @Test
    void generatePassword() {
    }

    @Test
    void changePassword() {
        Optional<UserSocu> userSocu = userRepository.findByEmail("hans@testcompany2.com");
        Response response = userService.changePassword("lsgjSJRGlgs1", "aAaAaAaA", userSocu.get().getId());
        Optional<UserSocu> userSocu2 = userRepository.findByEmail("hans@testcompany2.com");
        if (!(passwordEncoder.matches("aAaAaAaA", userSocu2.get().getPassword()))) {
            fail("Ändring av lösenord misslyckades.");
        }
    }

    @Test
    void updateUserInformation() {
    }

    @Test
    void getUserDTOById() {
    }

    @Test
    void getAttendees() {
    }

    @Test
    void getUserFromJWT() {
    }

    @Test
    void getUserIDFromJWT() {
    }

    @Test
    void checkIfLoginCredentialsAreCorrectAndGetUser() {
    }
}