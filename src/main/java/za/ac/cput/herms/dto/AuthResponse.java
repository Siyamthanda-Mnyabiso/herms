package za.ac.cput.herms.dto;

public class AuthResponse {
    private final String token;
    private final String role;
    private final String refId;
    private final String name;
    private final String email;

    public AuthResponse(String token, String role, String refId, String name, String email) {
        this.token = token;
        this.role = role;
        this.refId = refId;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getRefId() {
        return refId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
