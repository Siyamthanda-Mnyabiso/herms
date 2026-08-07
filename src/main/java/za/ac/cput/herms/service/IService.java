package za.ac.cput.herms.service;

public interface IService <T,ID>{
    T Create(T t);
    T Read(ID id);
    T Update(T t);
    boolean Delete(ID id);
}
