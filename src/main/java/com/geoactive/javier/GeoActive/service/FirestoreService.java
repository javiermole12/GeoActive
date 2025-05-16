package com.geoactive.javier.GeoActive.service;

import com.geoactive.javier.GeoActive.model.Activo;
import com.geoactive.javier.GeoActive.model.Usuario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.hibernate.sql.exec.ExecutionException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Query;
import org.threeten.bp.LocalDate;

@Service
public class FirestoreService {

    public void guardarActivo(Activo activo) throws ExecutionException, InterruptedException, java.util.concurrent.ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("activos").document(activo.getId()).set(activo).get();
    }

    public List<Activo> obtenerActivos() throws ExecutionException, InterruptedException, java.util.concurrent.ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("activos").get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        return docs.stream().map(doc -> doc.toObject(Activo.class)).collect(Collectors.toList());
    }

    public Map<String, Object> obtenerActivoPorId(String id) throws ExecutionException, InterruptedException, java.util.concurrent.ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference activoRef = db.collection("activos").document(id);
        DocumentSnapshot activoDoc = activoRef.get().get();
        if (!activoDoc.exists()) {
            return null;
        }
        Activo activo = activoDoc.toObject(Activo.class);
        List<Map<String, Object>> historial = new ArrayList<>();
        activoRef.collection("revisiones").orderBy("fecha", Query.Direction.DESCENDING).get().get().forEach(doc -> {
            historial.add(doc.getData());
        });
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("activo", activo);
        resultado.put("historial", historial);
        return resultado;
    }

    public void borrarActivo(String id) throws ExecutionException, InterruptedException, java.util.concurrent.ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("activos").document(id).delete().get();
    }

    public void registrarUsuario(Usuario usuario) throws ExecutionException, InterruptedException, java.util.concurrent.ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("usuarios").document(usuario.getId()).set(usuario).get();
    }

    public Usuario iniciarSesion(String email, String password) throws ExecutionException, InterruptedException, java.util.concurrent.ExecutionException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("usuarios").whereEqualTo("email", email).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        if (docs.isEmpty()) {
            return null;
        }
        Usuario usuario = docs.get(0).toObject(Usuario.class);
        if (usuario.getPassword().equals(password)) {
            return usuario;
        }
        return null;
    }

    public void cerrarSesion() {
        // En una implementación real, aquí se invalidaría el token de sesión
        // Por ahora, simplemente retornamos
    }

    public Map<String, Object> registrarRevision(String id, String revisadoPor) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference activoRef = db.collection("activos").document(id);
        DocumentSnapshot activoDoc = activoRef.get().get();
        if (!activoDoc.exists()) {
            throw new Exception("Activo no encontrado");
        }
        String fechaUltimaRevision = LocalDate.now().toString();
        Map<String, Object> revision = new HashMap<>();
        revision.put("fecha", fechaUltimaRevision);
        revision.put("revisadoPor", revisadoPor);
        activoRef.collection("revisiones").add(revision).get();
        Map<String, Object> actualizacion = new HashMap<>();
        actualizacion.put("fechaUltimaRevision", fechaUltimaRevision);
        actualizacion.put("revisadoPor", revisadoPor);
        activoRef.update(actualizacion).get();
        List<Map<String, Object>> historial = new ArrayList<>();
        activoRef.collection("revisiones").orderBy("fecha", Query.Direction.DESCENDING).get().get().forEach(doc -> {
            historial.add(doc.getData());
        });
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("fechaUltimaRevision", fechaUltimaRevision);
        resultado.put("revisadoPor", revisadoPor);
        resultado.put("historial", historial);
        return resultado;
    }

}
