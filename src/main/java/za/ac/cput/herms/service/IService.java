package za.ac.cput.herms.service;

import za.ac.cput.herms.domain.organization.Pharmacy;

import java.util.List;

public interface IService <T,ID>{
    T Create(T t);
    T Read(ID id);
    T Update(T t);
    boolean Delete(ID id);
}
