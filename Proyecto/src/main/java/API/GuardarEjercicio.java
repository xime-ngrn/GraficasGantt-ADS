package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
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
        request.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        // Datos generales del ejercicio
        String nombreEjercicio = request.getParameter("nombreEjercicio");
        String idUsuario = request.getParameter("idUsuario");

        // Arreglos paralelos: una entrada por tarea (mismo índice en los tres)
        String[] tareaNombre = request.getParameterValues("tareaNombre");
        String[] tareaInicio = request.getParameterValues("tareaInicio");
        String[] tareaFin = request.getParameterValues("tareaFin");

        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");

            String insertEjercicio =
                    "INSERT INTO Ejercicios (nombre, idLOGIN) VALUES ('"
                    + nombreEjercicio + "', " + idUsuario + ");";
            bd.executeUpdate(insertEjercicio);
            
            int idEjercicio = -1;
            ResultSet rs = bd.executeQuery("SELECT LAST_INSERT_ID() AS id;");
            if (rs.next()) {
                idEjercicio = rs.getInt("id");
            }

            if (tareaNombre != null) {
                for (int i = 0; i < tareaNombre.length; i++) {
                    String insertTarea =
                            "INSERT INTO Tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) VALUES ('"
                            + tareaNombre[i] + "', '"
                            + tareaInicio[i] + "', '"
                            + tareaFin[i] + "', "
                            + idEjercicio + ");";
                    bd.executeUpdate(insertTarea);
                }
            }

            out.println("{\"status\":\"yes\",\"idEjercicio\":" + idEjercicio + "}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"message\":\"No se pudo guardar el ejercicio\"}");
        }
    }
}