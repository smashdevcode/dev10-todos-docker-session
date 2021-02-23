package learn.todos.domain;

import learn.todos.data.AppUserJdbcTemplateRepository;
import learn.todos.models.AppUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;
import java.util.stream.Collectors;

// The `UserDetailsService` interface loads user-specific data.
// The interface requires only one read-only method, which simplifies support for new data-access strategies.
@Service
public class AppUserService implements UserDetailsService {
    private final AppUserJdbcTemplateRepository appUserJdbcTemplateRepository;
    private final PasswordEncoder encoder;

    public AppUserService(AppUserJdbcTemplateRepository appUserJdbcTemplateRepository,
                          PasswordEncoder encoder) {
        this.appUserJdbcTemplateRepository = appUserJdbcTemplateRepository;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserJdbcTemplateRepository.findByUsername(username);

        if (appUser == null || appUser.isDisabled()) {
            throw new UsernameNotFoundException(username + " not found.");
        }

        List<GrantedAuthority> authorities = appUser.getRoles().stream()
                .map(roleName -> new SimpleGrantedAuthority("ROLE_" + roleName))
                .collect(Collectors.toList());

        return new User(appUser.getUsername(), appUser.getPassword(), authorities);
    }

    public AppUser add(AppUser user) {
        validate(user);
        validatePassword(user);

        user.setPassword(encoder.encode(user.getPassword()));
        return appUserJdbcTemplateRepository.add(user);
    }

    private void validate(AppUser user) {
        if (user == null) {
            throw new ValidationException("user cannot be null");
        }

        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new ValidationException("username is required");
        }

        if (user.getUsername().length() > 50) {
            throw new ValidationException("username must be less than 50 characters");
        }
    }

    private void validatePassword(AppUser user) {
        String password = user.getPassword();
        if (password == null || password.length() < 8) {
            throw new ValidationException("password must be at least 8 characters");
        }

        int digits = 0;
        int letters = 0;
        int others = 0;
        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                digits++;
            } else if (Character.isLetter(c)) {
                letters++;
            } else {
                others++;
            }
        }

        if (digits == 0 || letters == 0 || others == 0) {
            throw new ValidationException("password must contain a digit, a letter, and a non-digit/non-letter");
        }
    }
}
