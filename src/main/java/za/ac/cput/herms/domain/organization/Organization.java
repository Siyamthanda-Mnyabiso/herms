package za.ac.cput.herms.domain.organization;


import jakarta.persistence.*;
import lombok.Getter;
import za.ac.cput.herms.domain.Address;
import za.ac.cput.herms.domain.ContactDetails;
import java.util.Objects;

@Entity
@Getter
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Organization {
    @Id
    @Column(nullable = false, updatable = false)
    private String organizationId;

    @Column(nullable = false)
    private String organizationName;

    @Embedded
    @Column(nullable = false)
    private ContactDetails contactDetails;

    @Embedded
    @Column(nullable = false)
    private Address address;

    protected Organization() {

    }

    protected Organization(Builder builder) {
        this.organizationId = builder.organizationId;
        this.organizationName = builder.organizationName;
        this.contactDetails = builder.contactDetails;
        this.address = builder.address;

    }

    @Override
    public String toString() {
        return "Organization ID" + organizationId +
                "\nOrganization Name" + organizationName +
                "\nContact Details" + contactDetails +
                "\nAddress" + address;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof Organization)) return false;
    return Objects.equals(organizationId, ((Organization)o).organizationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(organizationId);
    }


    public static class Builder {
        private String organizationId;
        private String organizationName;
        private ContactDetails contactDetails;
        private Address address;

        public Builder setOrganizationId(String organizationId){
            this.organizationId = organizationId;
            return this;
        }

        public Builder setOrganizationName(String organizationName){
            this.organizationName = organizationName;
            return this;
        }

        public Builder setContactDetails(ContactDetails contactDetails){
            this.contactDetails = contactDetails;
            return this;
        }

        public Builder setAddress(Address address){
            this.address = address;
            return this;
        }

        public Builder copy(Organization organization){
            this.organizationId = organization.organizationId;
            this.organizationName = organization.organizationName;
            this.contactDetails = organization.contactDetails;
            this.address = organization.address;
            return this;
        }

    }

}
