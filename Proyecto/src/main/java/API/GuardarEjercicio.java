package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "GuardarEjercicio", urlPatterns = {"/GuardarEjercicio"})
public class GuardarEjercicio extends HttpServlet {

    @Override
protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

    response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    response.setContentType("application/json;charset=UTF-8");

    PrintWriter out = response.getWriter();

    // Volvemos a leer mediante parámetros tradicionales de la petición
    String nombreEjercicio = request.getParameter("nombreEjercicio");
    String idUsuario = request.getParameter("idUsuario");

    String[] tareaNombre = request.getParameterValues("tareaNombre");
    String[] tareaInicio = request.getParameterValues("tareaInicio");
    String[] tareaFin = request.getParameterValues("tareaFin");
    String[] idTemporal = request.getParameterValues("idTemporal");
    String[] depTemporal = request.getParameterValues("depTemporal");

    try {
        DB bd = new DB();
        bd.setConnection("com.mysql.cj.jdbc.Driver",
                "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");

        // 1. Insertar el Ejercicio Maestro
        String insertEjercicio = "INSERT INTO ejercicios (nombre, idLOGIN) VALUES ('"
                + nombreEjercicio + "', " + idUsuario + ");";
        bd.executeUpdate(insertEjercicio);
        
        int idEjercicio = -1;
        ResultSet rs = bd.executeQuery("SELECT LAST_INSERT_ID() AS id;");
        if (rs.next()) {
            idEjercicio = rs.getInt("id");
        }

        // Mapa de equivalencias: ID Frontend -> ID Real de MySQL
        HashMap<String, Integer> mapaIds = new HashMap<>();

        // FASE 1: Crear las tareas físicas en la BD para recolectar sus IDs autonuméricos
        if (tareaNombre != null) {
            for (int i = 0; i < tareaNombre.length; i++) {
                String insertTarea = "INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) VALUES ('"
                        + tareaNombre[i] + "', '" + tareaInicio[i] + "', '" + tareaFin[i] + "', " + idEjercicio + ", NULL);";
                bd.executeUpdate(insertTarea);

                ResultSet rsT = bd.executeQuery("SELECT LAST_INSERT_ID() AS id;");
                if (rsT.next()) {
                    int idRealMySQL = rsT.getInt("id");
                    mapaIds.put(idTemporal[i], idRealMySQL);
                }
            }

            // FASE 2: Actualizar las dependencias cruzando los datos del mapa
            for (int i = 0; i < tareaNombre.length; i++) {
                // Validamos que exista una dependencia registrada que no sea vacía ni "null"
                if (depTemporal[i] != null && !depTemporal[i].trim().isEmpty() && !depTemporal[i].equals("null")) {
                    String dependenciaHijo = idTemporal[i];
                    String dependenciaPadre = depTemporal[i];

                    if (mapaIds.containsKey(dependenciaPadre) && mapaIds.containsKey(dependenciaHijo)) {
                        int idRealHijo = mapaIds.get(dependenciaHijo);
                        int idRealPadre = mapaIds.get(dependenciaPadre);

                        String updateDependencia = "UPDATE tareas SET idDependencia = " + idRealPadre 
                                + " WHERE idTAREA = " + idRealHijo + ";";
                        bd.executeUpdate(updateDependencia);
                    }
                }
            }
        }

        // Respuesta limpia y con sintaxis JSON válida
        out.println("{\"status\":\"yes\",\"idEjercicio\":" + idEjercicio + "}");

    } catch (Exception e) {
        e.printStackTrace();
        out.println("{\"status\":\"error\",\"message\":\"Error interno en el servidor al procesar el guardado.\"}");
    }
}
}